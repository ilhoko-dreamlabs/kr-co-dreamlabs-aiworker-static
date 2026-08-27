import assert from "node:assert/strict";
import {
  buildChatInsightRecord,
  classifyWorkerChatInsight
} from "../api/chat-insights.js";

const classification = classifyWorkerChatInsight(
  "worker.dreamlabs.co.kr Vercel 배포 상태를 확인해줘",
  "Vercel deployment와 Worker Runtime 로그를 확인해야 합니다."
);

assert.equal(classification.intent, "Vercel/배포 문의");
assert.equal(classification.serviceCategory, "Vercel Deployment");
assert.equal(classification.leadSignal, "medium");
assert.equal(classification.contactIntent, true);

const record = buildChatInsightRecord({
  sourceDomain: "worker.dreamlabs.co.kr",
  sourcePage: "/",
  sessionId: "test-worker-session",
  question: "RRA 응답이 사이트에 표시되지 않는 오류를 확인해줘",
  answer: "Remote Request API 응답 구조와 프론트 표시 로직을 함께 확인해야 합니다.",
  status: "완료",
  answerSource: "worker-rra",
  idempotencyKey: "test-idempotency-key",
  requestId: "test-request-id"
});

assert.equal(record.siteId, "worker-dreamlabs-co-kr");
assert.equal(record.sourceDomain, "worker.dreamlabs.co.kr");
assert.equal(record.siteType, "operations");
assert.equal(record.question, "RRA 응답이 사이트에 표시되지 않는 오류를 확인해줘");
assert.equal(record.answer, "Remote Request API 응답 구조와 프론트 표시 로직을 함께 확인해야 합니다.");
assert.equal(record.classification.intent, "장애/오류 문의");
assert.equal(record.classification.serviceCategory, "Remote Request API");
assert.equal(record.status, "완료");
assert.equal(record.leadStatus, "신규");
assert.equal(record.requestContext.idempotencyKey, "test-idempotency-key");

console.log("chat insight tests passed");
