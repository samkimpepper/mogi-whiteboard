import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import {
  dateInArchiveZone,
  renderWhiteboardChatArchive,
  slugifyFirstMessage,
} from "../src/render.js";

const transcript = {
  sessionId: "01a0abcd-fixture-session",
  startedAt: "2026-09-26T16:05:00.000Z",
  updatedAt: "2026-09-26T16:09:00.000Z",
  cliVersion: "0.999.0-test",
  model: "gpt-test-model",
  messages: [
    {
      order: 0,
      role: "user",
      phase: null,
      text: "첫 질문 줄\r\n둘째 줄\r\n",
      turnId: "turn-1",
      timestamp: "2026-09-26T16:05:00.000Z",
    },
    {
      order: 1,
      role: "assistant",
      phase: "commentary",
      text: "보고 1",
      turnId: "turn-1",
      timestamp: "2026-09-26T16:06:00.000Z",
    },
    {
      order: 2,
      role: "assistant",
      phase: "commentary",
      text: "보고 2",
      turnId: "turn-1",
      timestamp: "2026-09-26T16:07:00.000Z",
    },
    {
      order: 3,
      role: "assistant",
      phase: "final_answer",
      text: "답",
      turnId: "turn-1",
      timestamp: "2026-09-26T16:08:00.000Z",
    },
    {
      order: 4,
      role: "user",
      phase: null,
      text: "두번째",
      turnId: "turn-2",
      timestamp: "2026-09-26T16:09:00.000Z",
    },
  ],
};

const expectedBody = `# 첫 질문 줄

## 1. 모기

첫 질문 줄\r\n둘째 줄\r\n

### 화이트보드냥 · 진행

보고 1

### 화이트보드냥 · 진행

보고 2

### 화이트보드냥 · 최종

답

## 2. 모기

두번째
`;

test("renders deterministic searchable Markdown from visible messages", () => {
  const result = renderWhiteboardChatArchive(transcript);
  const expectedHash = createHash("sha256").update(expectedBody).digest("hex");
  const expectedMarkdown = `---
schema_version: 1
source: "codex"
role: "whiteboard-cat"
session_id: "01a0abcd-fixture-session"
started_at: "2026-09-26T16:05:00.000Z"
updated_at: "2026-09-26T16:09:00.000Z"
ended_at: null
archive_timezone: "Asia/Seoul"
codex_cli_version: "0.999.0-test"
model: "gpt-test-model"
turn_count: 2
visible_message_count: 5
content_sha256: "${expectedHash}"
---

${expectedBody}`;

  assert.equal(result.body, expectedBody);
  assert.equal(result.markdown, expectedMarkdown);
  assert.deepEqual(result.metadata, {
    schema_version: 1,
    source: "codex",
    role: "whiteboard-cat",
    session_id: "01a0abcd-fixture-session",
    started_at: "2026-09-26T16:05:00.000Z",
    updated_at: "2026-09-26T16:09:00.000Z",
    ended_at: null,
    archive_timezone: "Asia/Seoul",
    codex_cli_version: "0.999.0-test",
    model: "gpt-test-model",
    turn_count: 2,
    visible_message_count: 5,
    content_sha256: expectedHash,
  });
  assert.equal(result.fileName, "2026-09-27_첫-질문-줄--01a0abcd-fixture-session.md");
  assert.deepEqual(renderWhiteboardChatArchive(transcript), result);
});

test("renders an explicit finalization time without changing the body hash", () => {
  const live = renderWhiteboardChatArchive(transcript);
  const final = renderWhiteboardChatArchive(transcript, { endedAt: "2026-09-27T02:00:00.000Z" });

  assert.equal(final.metadata.ended_at, "2026-09-27T02:00:00.000Z");
  assert.equal(final.body, live.body);
  assert.equal(final.metadata.content_sha256, live.metadata.content_sha256);
  assert.match(final.markdown, /ended_at: "2026-09-27T02:00:00.000Z"/);
});

test("uses Seoul dates and caps Unicode slugs at sixty code points", () => {
  assert.equal(dateInArchiveZone("2026-09-26T15:00:00.000Z"), "2026-09-27");
  assert.equal(slugifyFirstMessage("  안녕, 화이트보드냥!  "), "안녕-화이트보드냥");
  assert.equal(Array.from(slugifyFirstMessage("냥".repeat(70))).length, 60);
});
