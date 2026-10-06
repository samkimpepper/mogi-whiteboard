import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Readable, Writable } from "node:stream";
import test from "node:test";

import { main } from "../bin/archive-hook.js";

function captureStream() {
  let value = "";
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      value += chunk.toString();
      callback();
    },
  });
  return { stream, value: () => value };
}

async function runMain(eventText, archiveHookEventImpl) {
  const stdout = captureStream();
  const stderr = captureStream();
  const exitCode = await main({
    stdin: Readable.from([eventText]),
    stdout: stdout.stream,
    stderr: stderr.stream,
    archiveHookEventImpl,
    projectRoot: process.cwd(),
    liveRoot: "/tmp/test-live-root",
    now: () => "2026-09-27T02:00:00.000Z",
  });
  return { exitCode, stdout: stdout.value(), stderr: stderr.value() };
}

function hookEvent(hookEventName) {
  return {
    hook_event_name: hookEventName,
    session_id: "01a0hook-fixture",
    transcript_path: "/tmp/rollout.jsonl",
    cwd: process.cwd(),
  };
}

test("successful and skipped lifecycle events emit valid empty JSON", async () => {
  for (const [hookEventName, status] of [["Stop", "archived"], ["SessionEnd", "archived"], ["Stop", "skipped"]]) {
    const result = await runMain(
      `${JSON.stringify(hookEvent(hookEventName))}\n`,
      async () => ({ status }),
    );

    assert.equal(result.exitCode, 0);
    assert.deepEqual(JSON.parse(result.stdout), {});
    assert.equal(result.stderr, "");
  }
});

test("Stop failures warn generically without blocking the turn", async () => {
  const result = await runMain(
    `${JSON.stringify(hookEvent("Stop"))}\n`,
    async () => {
      throw new Error("SECRET_PROMPT failure at /Users/private/path");
    },
  );

  assert.equal(result.exitCode, 0);
  assert.deepEqual(JSON.parse(result.stdout), {
    systemMessage: "Whiteboard chat archive failed; see the local error record.",
  });
  assert.equal(result.stderr, "");
  assert.doesNotMatch(result.stdout, /SECRET_PROMPT|Users\/private/);
});

test("SessionEnd failures return one generic error without conversation content", async () => {
  const result = await runMain(
    `${JSON.stringify(hookEvent("SessionEnd"))}\n`,
    async () => {
      throw new Error("SECRET_RESPONSE failure at /Users/private/path");
    },
  );

  assert.equal(result.exitCode, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "whiteboard-chat-archive: failed; see the local error record\n");
  assert.doesNotMatch(result.stderr, /SECRET_RESPONSE|Users\/private/);
});

test("malformed stdin returns one generic error with no stdout", async () => {
  const result = await runMain("SECRET_NOT_JSON", async () => ({ status: "archived" }));

  assert.equal(result.exitCode, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "whiteboard-chat-archive: failed; see the local error record\n");
  assert.doesNotMatch(result.stderr, /SECRET_NOT_JSON/);
});

test("project hooks run synchronous Stop and SessionEnd commands from the Git root", async () => {
  const config = JSON.parse(await readFile(".codex/hooks.json", "utf8"));

  assert.deepEqual(Object.keys(config.hooks).sort(), ["SessionEnd", "Stop"]);
  for (const hookEventName of ["Stop", "SessionEnd"]) {
    const handler = config.hooks[hookEventName][0].hooks[0];
    assert.equal(handler.type, "command");
    assert.equal(handler.timeout, 10);
    assert.equal(handler.async, undefined);
    assert.match(handler.command, /git rev-parse --show-toplevel/);
    assert.match(handler.command, /^node /);
    assert.match(handler.command, /integrations\/codex-chat\/bin\/archive-hook.js/);
  }
  assert.equal(config.hooks.SubagentStop, undefined);
});
