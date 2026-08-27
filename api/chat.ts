import { randomUUID } from "node:crypto";
import { recordChatInsight } from "./chat-insights.js";

const DEFAULT_RRA_URL = "https://worker0.dreamlabs.co.kr/api/v1/requests";

function getRemoteRequestUrl() {
  return process.env.REMOTE_REQUEST_API_URL || DEFAULT_RRA_URL;
}

function setCorsHeaders(res: any) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function normalizeDomain(value: string) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "");
}

function getRequestBody(req: any) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body !== "string") return {};

  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

function getClientContext(req: any, body: Record<string, any>) {
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
    sourcePage: typeof body?.sourcePage === "string" ? body.sourcePage : "",
    sessionId: typeof body?.sessionId === "string" ? body.sessionId : "",
    leadInfo: body?.leadInfo && typeof body.leadInfo === "object" ? body.leadInfo : {},
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

async function recordInsight(entry: {
  clientContext: ReturnType<typeof getClientContext>;
  prompt: string;
  answer: string;
  status: string;
  answerSource: string;
  errorCode?: string;
  idempotencyKey?: string;
  requestId?: string;
}) {
  if (!entry.answer) return;

  await recordChatInsight({
    ...entry.clientContext,
    question: entry.prompt,
    answer: entry.answer,
    status: entry.status,
    answerSource: entry.answerSource,
    errorCode: entry.errorCode || "",
    idempotencyKey: entry.idempotencyKey || "",
    requestId: entry.requestId || ""
  });
}

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const apiKey = process.env.REMOTE_REQUEST_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "missing_remote_request_api_key" });
  }

  const body = getRequestBody(req);
  const prompt =
    typeof body?.prompt === "string"
      ? body.prompt.trim()
      : typeof body?.message === "string"
        ? body.message.trim()
        : "";

  if (!prompt) {
    return res.status(400).json({ error: "prompt_required" });
  }

  const waitSeconds =
    typeof body?.waitSeconds === "number"
      ? Math.max(0, Math.min(30, Math.floor(body.waitSeconds)))
      : 30;

  const idempotencyKey =
    typeof body?.idempotencyKey === "string" && body.idempotencyKey.trim()
      ? body.idempotencyKey.trim()
      : randomUUID();
  const clientContext = getClientContext(req, body);

  const remoteResponse = await fetch(getRemoteRequestUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify({ prompt, waitSeconds })
  });

  const contentType = remoteResponse.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await remoteResponse.json()
    : { text: await remoteResponse.text() };

  if (remoteResponse.headers.has("retry-after")) {
    res.setHeader("Retry-After", remoteResponse.headers.get("retry-after"));
  }

  const reply = extractReply(payload);
  if (remoteResponse.ok && remoteResponse.status !== 202 && reply) {
    await recordInsight({
      clientContext,
      prompt,
      answer: reply,
      status: "완료",
      answerSource: "worker-rra",
      idempotencyKey,
      requestId: getRequestId(payload)
    });
  }

  return res.status(remoteResponse.status).json(payload);
}
