type ChatInsightEntry = {
  sourceDomain?: string;
  sourcePage?: string;
  sessionId?: string;
  question: string;
  answer: string;
  status?: string;
  answerSource?: string;
  errorCode?: string;
  idempotencyKey?: string;
  requestId?: string;
  leadInfo?: Record<string, unknown>;
  userAgent?: string;
  referrer?: string;
};

type WorkerChatClassification = {
  intent: string;
  industry: string;
  serviceCategory: string;
  contactIntent: boolean;
  leadSignal: string;
};

export function classifyWorkerChatInsight(question: string, answer: string): WorkerChatClassification;
export function buildChatInsightRecord(entry: ChatInsightEntry): Record<string, any>;
export function isDatabaseConfigured(): boolean;
export function normalizeLeadInfo(value: unknown): Record<string, unknown>;
export function recordChatInsight(entry: ChatInsightEntry): Promise<Record<string, unknown>>;
