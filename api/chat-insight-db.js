const DB_TIMEOUT_MS = 9000;

let cachedSql = null;
let schemaReady = false;

function getDatabaseUrl() {
  return process.env.CHAT_INSIGHTS_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

async function getSql() {
  if (cachedSql) return cachedSql;

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return null;

  const { neon } = await import("@neondatabase/serverless");
  cachedSql = neon(databaseUrl);
  return cachedSql;
}

async function withTimeout(operation, timeoutMs = DB_TIMEOUT_MS) {
  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error("chat_insights_db_timeout")), timeoutMs);
  });

  try {
    return await Promise.race([operation(), timeoutPromise]);
  } finally {
    clearTimeout(timeout);
  }
}

async function ensureSchema(sql) {
  if (schemaReady) return;

  await sql`
    CREATE TABLE IF NOT EXISTS chat_sites (
      site_id TEXT PRIMARY KEY,
      source_domain TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      site_type TEXT NOT NULL,
      owner_name TEXT,
      is_managed_customer BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      session_id TEXT PRIMARY KEY,
      site_id TEXT,
      source_domain TEXT NOT NULL,
      first_source_page TEXT,
      first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      user_agent TEXT,
      referrer TEXT
    )
  `;

  await sql`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS site_id TEXT`;

  await sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      session_id TEXT NOT NULL REFERENCES chat_sessions(session_id),
      site_id TEXT,
      source_domain TEXT NOT NULL,
      source_page TEXT,
      user_question TEXT NOT NULL,
      ai_answer TEXT NOT NULL,
      answer_summary TEXT,
      answer_source TEXT,
      status TEXT NOT NULL,
      error_code TEXT,
      lead_info JSONB NOT NULL DEFAULT '{}'::jsonb,
      request_context JSONB NOT NULL DEFAULT '{}'::jsonb
    )
  `;

  await sql`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS site_id TEXT`;

  await sql`
    CREATE TABLE IF NOT EXISTS lead_insights (
      id BIGSERIAL PRIMARY KEY,
      chat_message_id BIGINT NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      session_id TEXT NOT NULL,
      site_id TEXT,
      source_domain TEXT NOT NULL,
      intent TEXT,
      industry TEXT,
      service_category TEXT,
      lead_signal TEXT,
      contact_intent BOOLEAN NOT NULL DEFAULT FALSE,
      prospect_name TEXT,
      company TEXT,
      contact TEXT,
      consent BOOLEAN NOT NULL DEFAULT FALSE,
      follow_up_requested BOOLEAN NOT NULL DEFAULT FALSE,
      recommended_follow_up TEXT,
      owner TEXT,
      status TEXT NOT NULL DEFAULT 'new'
    )
  `;

  await sql`ALTER TABLE lead_insights ADD COLUMN IF NOT EXISTS site_id TEXT`;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at
    ON chat_messages (created_at DESC)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id
    ON chat_messages (session_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_lead_insights_created_at
    ON lead_insights (created_at DESC)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_lead_insights_signal
    ON lead_insights (lead_signal, contact_intent)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_site_created_at
    ON chat_messages (site_id, created_at DESC)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_lead_insights_site_signal
    ON lead_insights (site_id, lead_signal, status)
  `;

  schemaReady = true;
}

function toJson(value) {
  return JSON.stringify(value || {});
}

async function insertChatInsight(record) {
  if (!isDatabaseConfigured()) {
    return { skipped: true, reason: "db_not_configured" };
  }

  return withTimeout(async () => {
    const sql = await getSql();
    if (!sql) return { skipped: true, reason: "db_not_configured" };

    await ensureSchema(sql);

    await sql`
      INSERT INTO chat_sites (
        site_id,
        source_domain,
        display_name,
        site_type,
        owner_name,
        is_managed_customer,
        updated_at
      )
      VALUES (
        ${record.siteId},
        ${record.sourceDomain},
        ${record.siteDisplayName},
        ${record.siteType},
        ${record.siteOwnerName},
        ${record.isManagedCustomer},
        NOW()
      )
      ON CONFLICT (source_domain) DO UPDATE
      SET
        site_id = EXCLUDED.site_id,
        display_name = EXCLUDED.display_name,
        site_type = EXCLUDED.site_type,
        owner_name = EXCLUDED.owner_name,
        is_managed_customer = EXCLUDED.is_managed_customer,
        updated_at = NOW()
    `;

    await sql`
      INSERT INTO chat_sessions (
        session_id,
        site_id,
        source_domain,
        first_source_page,
        user_agent,
        referrer
      )
      VALUES (
        ${record.sessionId},
        ${record.siteId},
        ${record.sourceDomain},
        ${record.sourcePage},
        ${record.userAgent},
        ${record.referrer}
      )
      ON CONFLICT (session_id) DO UPDATE
      SET
        last_seen_at = NOW(),
        site_id = COALESCE(EXCLUDED.site_id, chat_sessions.site_id),
        user_agent = COALESCE(NULLIF(EXCLUDED.user_agent, ''), chat_sessions.user_agent),
        referrer = COALESCE(NULLIF(EXCLUDED.referrer, ''), chat_sessions.referrer)
    `;

    const insertedMessages = await sql`
      INSERT INTO chat_messages (
        session_id,
        site_id,
        source_domain,
        source_page,
        user_question,
        ai_answer,
        answer_summary,
        answer_source,
        status,
        error_code,
        lead_info,
        request_context
      )
      VALUES (
        ${record.sessionId},
        ${record.siteId},
        ${record.sourceDomain},
        ${record.sourcePage},
        ${record.question},
        ${record.answer},
        ${record.answerSummary},
        ${record.answerSource},
        ${record.status},
        ${record.errorCode},
        ${toJson(record.leadInfo)}::jsonb,
        ${toJson(record.requestContext)}::jsonb
      )
      RETURNING id
    `;

    const chatMessageId = insertedMessages?.[0]?.id;
    if (!chatMessageId) throw new Error("chat_message_insert_missing_id");

    await sql`
      INSERT INTO lead_insights (
        chat_message_id,
        session_id,
        site_id,
        source_domain,
        intent,
        industry,
        service_category,
        lead_signal,
        contact_intent,
        prospect_name,
        company,
        contact,
        consent,
        follow_up_requested,
        recommended_follow_up,
        owner,
        status
      )
      VALUES (
        ${chatMessageId},
        ${record.sessionId},
        ${record.siteId},
        ${record.sourceDomain},
        ${record.classification.intent},
        ${record.classification.industry},
        ${record.classification.serviceCategory},
        ${record.classification.leadSignal},
        ${record.classification.contactIntent},
        ${record.leadInfo.name || ""},
        ${record.leadInfo.company || ""},
        ${record.leadInfo.contact || ""},
        ${record.leadInfo.privacyConsent},
        ${record.followUpRequested},
        ${record.recommendedFollowUp},
        ${record.owner || ""},
        ${record.leadStatus || "신규"}
      )
    `;

    return { inserted: true, chatMessageId };
  });
}

export {
  insertChatInsight,
  isDatabaseConfigured
};
