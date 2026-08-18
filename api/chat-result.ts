const DEFAULT_RRA_URL = "https://worker0.dreamlabs.co.kr/api/v1/requests";

function getAllowedRemoteOrigin() {
  return new URL(process.env.REMOTE_REQUEST_API_URL || DEFAULT_RRA_URL).origin;
}

function setCorsHeaders(res: any) {
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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

  return res.status(remoteResponse.status).json(payload);
}
