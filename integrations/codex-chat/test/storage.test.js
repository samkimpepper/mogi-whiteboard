import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  ArchiveConflictError,
  persistFinalArchive,
  persistLiveArchive,
  writeAtomicIfChanged,
} from "../src/storage.js";
import { renderWhiteboardChatArchive } from "../src/render.js";

function transcript({ sessionId = "01a0abcd-fixture", answer = "첫 답" } = {}) {
  return {
    sessionId,
    startedAt: "2026-09-26T16:05:00.000Z",
    updatedAt: "2026-09-26T16:06:00.000Z",
    cliVersion: "0.999.0-test",
    model: "gpt-test-model",
    messages: [
      {
        order: 0,
        role: "user",
        phase: null,
        text: "첫 질문",
        turnId: "turn-1",
        timestamp: "2026-09-26T16:05:00.000Z",
      },
      {
        order: 1,
        role: "assistant",
        phase: "final_answer",
        text: answer,
        turnId: "turn-1",
        timestamp: "2026-09-26T16:06:00.000Z",
      },
    ],
  };
}

function assertConflict(action, code) {
  return assert.rejects(action, (error) => {
    assert.ok(error instanceof ArchiveConflictError);
    assert.equal(error.code, code);
    return true;
  });
}

test("atomically creates, updates, and skips identical bytes", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "mogi-whiteboard-chat-storage-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const destination = path.join(root, "nested", "record.md");

  assert.equal(await writeAtomicIfChanged(destination, "first\n"), "created");
  assert.equal(await readFile(destination, "utf8"), "first\n");
  const firstStat = await stat(destination);
  assert.equal(firstStat.mode & 0o777, 0o600);

  assert.equal(await writeAtomicIfChanged(destination, "first\n"), "unchanged");
  const unchangedStat = await stat(destination);
  assert.equal(unchangedStat.ino, firstStat.ino);
  assert.equal(unchangedStat.mtimeMs, firstStat.mtimeMs);

  assert.equal(await writeAtomicIfChanged(destination, "second\n"), "updated");
  assert.equal(await readFile(destination, "utf8"), "second\n");
  assert.deepEqual(await readdir(path.dirname(destination)), ["record.md"]);
});

test("stores live archives by sanitized session id", async (t) => {
  const liveRoot = await mkdtemp(path.join(os.tmpdir(), "mogi-whiteboard-chat-live-"));
  t.after(() => rm(liveRoot, { recursive: true, force: true }));
  const artifact = {
    markdown: "visible archive\n",
    metadata: { session_id: "01a0_test-session" },
  };

  assert.equal(await persistLiveArchive(artifact, { liveRoot }), "created");
  assert.equal(await readFile(path.join(liveRoot, "01a0_test-session.md"), "utf8"), "visible archive\n");
  await assert.rejects(
    persistLiveArchive({ ...artifact, metadata: { session_id: "../escape" } }, { liveRoot }),
    /invalid_session_id/,
  );
});

test("creates, skips, and updates an unmodified generated final record", async (t) => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "mogi-whiteboard-chat-final-"));
  t.after(() => rm(projectRoot, { recursive: true, force: true }));
  const finalRoot = path.join(projectRoot, ".local", "chat-archive", "final");
  const first = renderWhiteboardChatArchive(transcript(), { endedAt: "2026-09-27T02:00:00.000Z" });
  const destination = path.join(finalRoot, first.fileName);

  assert.equal(await persistFinalArchive(first, { projectRoot, finalRoot }), "created");
  assert.equal(await persistFinalArchive(first, { projectRoot, finalRoot }), "unchanged");
  const beforeUpdate = await readFile(destination, "utf8");

  const updated = renderWhiteboardChatArchive(transcript({ answer: "고친 답" }), {
    endedAt: "2026-09-27T02:05:00.000Z",
  });
  assert.equal(updated.fileName, first.fileName);
  assert.equal(await persistFinalArchive(updated, { projectRoot, finalRoot }), "updated");
  assert.notEqual(await readFile(destination, "utf8"), beforeUpdate);
  assert.match(await readFile(destination, "utf8"), /고친 답/);
});

test("preserves a final record owned by another session", async (t) => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "mogi-whiteboard-chat-session-conflict-"));
  t.after(() => rm(projectRoot, { recursive: true, force: true }));
  const finalRoot = path.join(projectRoot, ".local", "chat-archive", "final");
  const first = renderWhiteboardChatArchive(transcript(), { endedAt: "2026-09-27T02:00:00.000Z" });
  await persistFinalArchive(first, { projectRoot, finalRoot });
  const destination = path.join(finalRoot, first.fileName);
  const before = await readFile(destination, "utf8");
  const other = {
    ...renderWhiteboardChatArchive(transcript({ sessionId: "01a0other-session" }), {
      endedAt: "2026-09-27T02:05:00.000Z",
    }),
    fileName: first.fileName,
  };

  await assertConflict(
    persistFinalArchive(other, { projectRoot, finalRoot }),
    "session_id_mismatch",
  );
  assert.equal(await readFile(destination, "utf8"), before);
});

test("preserves a manually changed final body", async (t) => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "mogi-whiteboard-chat-body-conflict-"));
  t.after(() => rm(projectRoot, { recursive: true, force: true }));
  const finalRoot = path.join(projectRoot, ".local", "chat-archive", "final");
  const first = renderWhiteboardChatArchive(transcript(), { endedAt: "2026-09-27T02:00:00.000Z" });
  await persistFinalArchive(first, { projectRoot, finalRoot });
  const destination = path.join(finalRoot, first.fileName);
  const manuallyChanged = (await readFile(destination, "utf8")).replace("첫 답", "사람 수정");
  await writeFile(destination, manuallyChanged, "utf8");

  const updated = renderWhiteboardChatArchive(transcript({ answer: "새 답" }), {
    endedAt: "2026-09-27T02:05:00.000Z",
  });
  await assertConflict(
    persistFinalArchive(updated, { projectRoot, finalRoot }),
    "body_hash_mismatch",
  );
  assert.equal(await readFile(destination, "utf8"), manuallyChanged);
});

test("preserves an existing destination without generated metadata", async (t) => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "mogi-whiteboard-chat-metadata-conflict-"));
  t.after(() => rm(projectRoot, { recursive: true, force: true }));
  const finalRoot = path.join(projectRoot, ".local", "chat-archive", "final");
  const artifact = renderWhiteboardChatArchive(transcript(), { endedAt: "2026-09-27T02:00:00.000Z" });
  const destination = path.join(finalRoot, artifact.fileName);
  await mkdir(finalRoot, { recursive: true });
  await writeFile(destination, "handwritten source\n", "utf8");

  await assertConflict(
    persistFinalArchive(artifact, { projectRoot, finalRoot }),
    "missing_generated_metadata",
  );
  assert.equal(await readFile(destination, "utf8"), "handwritten source\n");
});
