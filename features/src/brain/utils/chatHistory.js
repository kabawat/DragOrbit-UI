import { generateUUID } from "@dragorbit/core/utils/uuid.util";

export const MAX_CHAT_SESSIONS = 40;

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function toMs(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (!value) return Date.now();
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

export function normalizeSessionSummary(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = raw.id || raw.sessionId;
  if (!id) return null;
  return {
    id: String(id),
    title: String(raw.title || "New chat"),
    createdAt: toMs(raw.createdAt || raw.created_at),
    updatedAt: toMs(raw.updatedAt || raw.updated_at),
  };
}

export function mapHistoryMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages.map((item) => ({
    id: String(item?.id || generateUUID()),
    role: item?.role === "user" ? "user" : "assistant",
    content: typeof item?.content === "string" ? item.content : "",
    createdAt: toMs(item?.createdAt || item?.created_at),
    ...(Array.isArray(item?.toolResults)
      ? { toolResults: item.toolResults }
      : Array.isArray(item?.tool_results)
        ? { toolResults: item.tool_results }
        : {}),
  }));
}

export function groupSessionsByDay(sessions) {
  const today = startOfDay(Date.now());
  const yesterday = today - 24 * 60 * 60 * 1000;
  const week = today - 6 * 24 * 60 * 60 * 1000;
  const buckets = { today: [], yesterday: [], week: [], older: [] };
  for (const session of sessions) {
    const ts = startOfDay(session.updatedAt || session.createdAt || 0);
    if (ts >= today) buckets.today.push(session);
    else if (ts >= yesterday) buckets.yesterday.push(session);
    else if (ts >= week) buckets.week.push(session);
    else buckets.older.push(session);
  }
  return buckets;
}

export function titleFromUserText(text) {
  const cleaned = String(text || "")
    .trim()
    .replace(/\s+/g, " ");
  if (!cleaned) return "New chat";
  return cleaned.length > 42 ? `${cleaned.slice(0, 42)}…` : cleaned;
}
