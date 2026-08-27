import { insertChatInsight, isDatabaseConfigured } from "./chat-insight-db.js";

let warnedDatabaseNotConfigured = false;

function sanitizeField(value, maxLength = 4000) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizeDomain(value) {
  return sanitizeField(value || process.env.CHAT_SITE_DOMAIN || "worker.dreamlabs.co.kr", 180)
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "");
}

function makeSiteId(domain) {
  return sanitizeField(process.env.CHAT_SITE_ID, 80)
    || domain.replace(/^www\./, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    || "worker-dreamlabs-co-kr";
}

function getSiteProfile(sourceDomain) {
  const domain = normalizeDomain(process.env.CHAT_SITE_DOMAIN || sourceDomain || "worker.dreamlabs.co.kr");

  return {
    siteId: makeSiteId(domain),
    sourceDomain: domain,
    displayName: sanitizeField(process.env.CHAT_SITE_DISPLAY_NAME, 120) || "DreamLabs Worker",
    siteType: sanitizeField(process.env.CHAT_SITE_TYPE, 40) || "operations",
    ownerName: sanitizeField(process.env.CHAT_SITE_OWNER_NAME, 120) || "DreamLabs",
    isManagedCustomer: process.env.CHAT_SITE_MANAGED_CUSTOMER === "1"
  };
}

function normalizeLeadInfo(value) {
  if (!value || typeof value !== "object") return { privacyConsent: false };
  const consent = value.privacyConsent === true || value.privacyConsent === "true";
  if (!consent) return { privacyConsent: false };

  return {
    name: sanitizeField(value.name, 120),
    company: sanitizeField(value.company, 160),
    contact: sanitizeField(value.contact, 200),
    privacyConsent: true
  };
}

function classifyWorkerChatInsight(question, answer) {
  const text = `${question} ${answer}`.toLowerCase();
  const includesAny = (terms) => terms.some((term) => text.includes(term.toLowerCase()));

  let intent = "기타";
  if (includesAny(["상태", "status", "health", "정상", "확인", "점검", "로그"])) intent = "시스템 상태 확인";
  if (includesAny(["dns", "도메인", "domain", "cname", "레코드", "인증서", "ssl", "https"])) intent = "DNS/도메인 문의";
  if (includesAny(["server", "서버", "runtime", "런타임", "worker0", "worker00", "rra", "remote request"])) intent = "서버/런타임 문의";
  if (includesAny(["vercel", "배포", "deploy", "deployment", "production", "빌드", "build"])) intent = "Vercel/배포 문의";
  if (includesAny(["장애", "오류", "에러", "실패", "안됨", "불가", "timeout", "429", "503", "500"])) intent = "장애/오류 문의";
  if (includesAny(["절차", "운영", "가이드", "정책", "권한", "승인", "runbook", "런북"])) intent = "운영 절차 문의";

  let serviceCategory = "Operations";
  if (includesAny(["runtime", "런타임", "worker", "worker0", "worker00"])) serviceCategory = "Worker Runtime";
  if (includesAny(["rra", "remote request", "api/v1/requests", "idempotency", "request api"])) serviceCategory = "Remote Request API";
  if (includesAny(["dns", "domain", "도메인", "cname", "ssl", "https", "인증서"])) serviceCategory = "DNS / Domain";
  if (includesAny(["github", "gitlab", "repo", "repository", "커밋", "브랜치", "main"])) serviceCategory = "GitHub / GitLab";
  if (includesAny(["database", "db", "postgres", "neon", "storage", "데이터베이스", "저장"])) serviceCategory = "Database / Storage";
  if (includesAny(["security", "access", "secret", "api key", "권한", "보안", "인증"])) serviceCategory = "Security / Access";
  if (includesAny(["vercel", "배포", "deploy", "deployment", "build", "production"])) serviceCategory = "Vercel Deployment";

  const contactIntent = includesAny(["확인해줘", "처리해줘", "도와줘", "문의", "요청", "장애", "오류", "실패", "배포", "점검"]);
  let leadSignal = "low";
  if (contactIntent) leadSignal = "medium";
  if (includesAny(["장애", "오류", "실패", "긴급", "503", "429", "500", "운영중단", "안됨"])) leadSignal = "high";

  return {
    intent,
    industry: "운영/시스템",
    serviceCategory,
    contactIntent,
    leadSignal
  };
}

function buildChatInsightRecord(entry) {
  const site = getSiteProfile(entry.sourceDomain);
  const leadInfo = normalizeLeadInfo(entry.leadInfo);
  const classification = classifyWorkerChatInsight(entry.question, entry.answer);
  const answerSummary = sanitizeField(entry.answer, 220);
  const followUpRequested = classification.contactIntent || leadInfo.privacyConsent;
  const recommendedFollowUp = followUpRequested
    ? "운영 문의 확인: 대상 시스템, 발생 시각, 재현 절차, 영향 범위, 필요한 조치를 확인"
    : "";

  return {
    siteId: site.siteId,
    sourceDomain: site.sourceDomain,
    siteDisplayName: site.displayName,
    siteType: site.siteType,
    siteOwnerName: site.ownerName,
    isManagedCustomer: site.isManagedCustomer,
    sourcePage: sanitizeField(entry.sourcePage, 500),
    sessionId: sanitizeField(entry.sessionId, 160) || `anonymous-${Date.now()}`,
    question: sanitizeField(entry.question, 4000),
    answer: sanitizeField(entry.answer, 6000),
    answerSummary,
    answerSource: sanitizeField(entry.answerSource || "", 80),
    status: sanitizeField(entry.status || "완료", 80),
    errorCode: sanitizeField(entry.errorCode || "", 120),
    userAgent: sanitizeField(entry.userAgent || "", 600),
    referrer: sanitizeField(entry.referrer || "", 600),
    leadInfo,
    classification,
    followUpRequested,
    recommendedFollowUp,
    owner: "",
    leadStatus: sanitizeField(entry.leadStatus || "신규", 80),
    requestContext: {
      userAgent: sanitizeField(entry.userAgent || "", 600),
      referrer: sanitizeField(entry.referrer || "", 600),
      idempotencyKey: sanitizeField(entry.idempotencyKey || "", 120),
      requestId: sanitizeField(entry.requestId || "", 180)
    }
  };
}

async function recordChatInsight(entry) {
  const record = buildChatInsightRecord(entry);
  const result = { db: null };

  try {
    result.db = await insertChatInsight(record);
  } catch (error) {
    console.warn("chat_insights_db_insert_failed", error?.name || error?.message || "unknown_error");
    result.db = { failed: true };
  }

  if (!isDatabaseConfigured() && !warnedDatabaseNotConfigured) {
    warnedDatabaseNotConfigured = true;
    console.warn("chat_insights_db_not_configured");
  }

  return result;
}

export {
  buildChatInsightRecord,
  classifyWorkerChatInsight,
  isDatabaseConfigured,
  normalizeLeadInfo,
  recordChatInsight
};
