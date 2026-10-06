import { createHash } from "node:crypto";

export const ARCHIVE_TIME_ZONE = "Asia/Seoul";

export function dateInArchiveZone(timestamp) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ARCHIVE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function firstLine(text) {
  const normalized = normalizeMessageText(text);
  return normalized.split("\n").find((line) => line.trim().length > 0)?.trim() || "untitled";
}

export function slugifyFirstMessage(text) {
  const slug = String(firstLine(text))
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return Array.from(slug || "untitled").slice(0, 60).join("").replace(/-+$/g, "");
}

function normalizeMessageText(text) {
  return String(text).replace(/\r\n?/g, "\n").replace(/\n+$/g, "");
}

function yamlScalar(value) {
  if (value === null) {
    return "null";
  }
  if (typeof value === "number") {
    return String(value);
  }
  return JSON.stringify(value);
}

function renderBody(messages) {
  const firstUser = messages.find((message) => message.role === "user");
  const title = firstLine(firstUser.text);
  let turn = 0;
  const sections = [];

  for (const message of messages) {
    if (message.role === "user") {
      turn += 1;
      sections.push(`## ${turn}. 모기\n\n${message.text}`);
      continue;
    }
    const label = message.phase === "commentary" ? "진행" : "최종";
    sections.push(`### 화이트보드냥 · ${label}\n\n${message.text}`);
  }

  return [`# ${title}`, "", ...sections.flatMap((section) => [section, ""])].join("\n");
}

export function renderWhiteboardChatArchive(transcript, { endedAt = null } = {}) {
  const body = renderBody(transcript.messages);
  const contentHash = createHash("sha256").update(body).digest("hex");
  const turnCount = transcript.messages.filter((message) => message.role === "user").length;
  const metadata = {
    schema_version: 1,
    source: "codex",
    role: "whiteboard-cat",
    session_id: transcript.sessionId,
    started_at: transcript.startedAt,
    updated_at: transcript.updatedAt,
    ended_at: endedAt,
    archive_timezone: ARCHIVE_TIME_ZONE,
    codex_cli_version: transcript.cliVersion,
    model: transcript.model,
    turn_count: turnCount,
    visible_message_count: transcript.messages.length,
    content_sha256: contentHash,
  };
  const frontmatter = Object.entries(metadata).map(([key, value]) => `${key}: ${yamlScalar(value)}`);
  const markdown = ["---", ...frontmatter, "---", "", body].join("\n");
  const firstUser = transcript.messages.find((message) => message.role === "user");
  const sessionSuffix = transcript.sessionId.replace(/[^A-Za-z0-9_-]/g, "");
  const fileName = `${dateInArchiveZone(transcript.startedAt)}_${slugifyFirstMessage(firstUser.text)}--${sessionSuffix}.md`;

  return { markdown, body, metadata, fileName };
}
