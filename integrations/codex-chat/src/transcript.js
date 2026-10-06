import path from "node:path";

export class TranscriptFormatError extends Error {
  constructor(code) {
    super(`Codex transcript format error: ${code}`);
    this.name = "TranscriptFormatError";
    this.code = code;
  }
}

function isInsideProject(candidate, projectRoot) {
  const root = path.resolve(projectRoot);
  const resolved = path.resolve(candidate);
  const relative = path.relative(root, resolved);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function parseRecords(jsonl) {
  if (typeof jsonl !== "string" || !jsonl.endsWith("\n")) {
    throw new TranscriptFormatError("incomplete_jsonl");
  }

  const lines = jsonl.slice(0, -1).split("\n");
  if (lines.length === 0 || lines.some((line) => line.length === 0)) {
    throw new TranscriptFormatError("invalid_jsonl");
  }

  try {
    return lines.map((line) => JSON.parse(line));
  } catch {
    throw new TranscriptFormatError("invalid_jsonl");
  }
}

function visibleOrder(item) {
  if (!Object.hasOwn(item.metadata ?? {}, "user_input_order")) {
    return null;
  }
  const order = item.metadata.user_input_order;
  if (!Number.isSafeInteger(order) || order < 0) {
    throw new TranscriptFormatError("invalid_message_order");
  }
  return order;
}

function visibleText(payload) {
  const expectedType = payload.role === "user" ? "input_text" : "output_text";
  if (!Array.isArray(payload.content) || payload.content.length === 0) {
    throw new TranscriptFormatError("invalid_message_content");
  }
  if (payload.content.some((part) => part?.type !== expectedType || typeof part.text !== "string")) {
    throw new TranscriptFormatError("invalid_message_content");
  }
  return payload.content.map((part) => part.text).join("");
}

export function parseVisibleTranscript(jsonl, { sessionId, projectRoot }) {
  const records = parseRecords(jsonl);
  const first = records[0];
  const session = first?.payload;

  if (first?.type !== "session_meta" || session?.id !== sessionId) {
    throw new TranscriptFormatError("session_mismatch");
  }
  if (typeof session.cwd !== "string" || !isInsideProject(session.cwd, projectRoot)) {
    throw new TranscriptFormatError("cwd_outside_project");
  }

  let model = null;
  const messages = [];
  const seenOrders = new Set();
  for (const item of records.slice(1)) {
    if (item.type === "turn_context" && typeof item.payload?.model === "string") {
      model = item.payload.model;
      continue;
    }

    const payload = item.payload;
    if (item.type !== "response_item" || payload?.type !== "message") {
      continue;
    }
    const order = visibleOrder(item);
    if (order === null) {
      continue;
    }
    if (seenOrders.has(order)) {
      throw new TranscriptFormatError("duplicate_message_order");
    }
    seenOrders.add(order);
    if (payload.role !== "user" && payload.role !== "assistant") {
      throw new TranscriptFormatError("invalid_message_role");
    }
    if (payload.role === "assistant" && payload.phase !== "commentary" && payload.phase !== "final_answer") {
      throw new TranscriptFormatError("unknown_assistant_phase");
    }
    if (typeof item.timestamp !== "string" || !Number.isFinite(Date.parse(item.timestamp))) {
      throw new TranscriptFormatError("invalid_message_timestamp");
    }
    const turnId = payload.internal_chat_message_metadata_passthrough?.turn_id;
    if (typeof turnId !== "string" || turnId.length === 0) {
      throw new TranscriptFormatError("invalid_message_metadata");
    }

    const text = visibleText(payload);

    messages.push({
      order,
      role: payload.role,
      phase: payload.role === "assistant" ? payload.phase ?? null : null,
      text,
      turnId,
      timestamp: item.timestamp,
    });
  }

  messages.sort((left, right) => left.order - right.order);
  const firstUser = messages.find((message) => message.role === "user");
  if (!firstUser) {
    throw new TranscriptFormatError("missing_user_message");
  }
  return {
    sessionId,
    startedAt: firstUser.timestamp,
    updatedAt: messages.at(-1)?.timestamp ?? null,
    cliVersion: session.cli_version ?? null,
    model,
    messages,
  };
}
