import { randomUUID } from "node:crypto";

const DEFAULT_RRA_URL = "https://worker0.dreamlabs.co.kr/api/v1/requests";

function getRemoteRequestUrl() {
  return process.env.REMOTE_REQUEST_API_URL || DEFAULT_RRA_URL;
}

function setCorsHeaders(res: any) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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

  const prompt =
    typeof req.body?.prompt === "string"
      ? req.body.prompt.trim()
      : typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

  if (!prompt) {
    return res.status(400).json({ error: "prompt_required" });
  }

  const waitSeconds =
    typeof req.body?.waitSeconds === "number"
      ? Math.max(0, Math.min(30, Math.floor(req.body.waitSeconds)))
      : 30;

  const idempotencyKey =
    typeof req.body?.idempotencyKey === "string" && req.body.idempotencyKey.trim()
      ? req.body.idempotencyKey.trim()
      : randomUUID();

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

  return res.status(remoteResponse.status).json(payload);
}
