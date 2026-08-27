import { recordChatInsight } from "./chat-insights.js";

const DEFAULT_RRA_URL = "https://worker0.dreamlabs.co.kr/api/v1/requests";

function getAllowedRemoteOrigin() {
  return new URL(process.env.REMOTE_REQUEST_API_URL || DEFAULT_RRA_URL).origin;
}

function setCorsHeaders(res: any) {
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function normalizeDomain(value: string) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "");
}

function getClientContext(req: any) {
  const headers = req.headers || {};
  const sourceDomain = normalizeDomain(
    String(
      process.env.CHAT_SITE_DOMAIN ||
        headers["x-forwarded-host"] ||
        headers.host ||
        "worker.dreamlabs.co.kr"
    )
  );

  return {
    sourceDomain,
    sourcePage: typeof req.query?.sourcePage === "string" ? req.query.sourcePage : "",
    sessionId: typeof req.query?.sessionId === "string" ? req.query.sessionId : "",
    leadInfo: {},
    userAgent: headers["user-agent"] || headers["User-Agent"] || "",
    referrer: headers.referer || headers.referrer || headers.Referer || ""
  };
}

function extractReply(payload: unknown): string {
  if (typeof payload === "string") return payload.trim();
  if (!payload || typeof payload !== "object") return "";

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.reply,
    record.resultSummary,
    record.output,
    record.text,
    record.content,
    record.message,
    record.result,
    record.response,
    record.data
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }

    if (candidate && typeof candidate === "object") {
      const nested = extractReply(candidate);
      if (nested) return nested;
    }
  }

  return "";
}

function getRequestId(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const value = (payload as Record<string, unknown>).requestId;
  return typeof value === "string" ? value : "";
}

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const apiKey = process.env.REMOTE_REQUEST_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "missing_remote_request_api_key" });
  }

  const resultUrl = typeof req.query?.resultUrl === "string" ? req.query.resultUrl : "";

  if (!resultUrl) {
    return res.status(400).json({ error: "result_url_required" });
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(resultUrl);
  } catch {
    return res.status(400).json({ error: "invalid_result_url" });
  }

  if (parsedUrl.origin !== getAllowedRemoteOrigin()) {
    return res.status(400).json({ error: "invalid_result_origin" });
  }

  const remoteResponse = await fetch(parsedUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

  const contentType = remoteResponse.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await remoteResponse.json()
    : { text: await remoteResponse.text() };

  if (remoteResponse.headers.has("retry-after")) {
    res.setHeader("Retry-After", remoteResponse.headers.get("retry-after"));
  }

  const prompt = typeof req.query?.prompt === "string" ? req.query.prompt.trim() : "";
  const reply = extractReply(payload);
  if (remoteResponse.ok && remoteResponse.status !== 202 && prompt && reply) {
    await recordChatInsight({
      ...getClientContext(req),
      question: prompt,
      answer: reply,
      status: "완료",
      answerSource: "worker-rra",
      idempotencyKey: typeof req.query?.idempotencyKey === "string" ? req.query.idempotencyKey : "",
      requestId: getRequestId(payload)
    });
  }

  return res.status(remoteResponse.status).json(payload);
}
