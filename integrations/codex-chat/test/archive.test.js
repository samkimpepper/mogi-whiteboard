import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import { archiveHookEvent, inspectWorktree } from "../src/archive.js";

const SESSION_ID = "01a0archive-fixture";
const execFileAsync = promisify(execFile);

function message({ role, text, order, phase, turnId }) {
  return {
    type: "response_item",
    timestamp: `2026-09-27T01:00:0${order + 1}.000Z`,
    metadata: { client_authored: false, user_input_order: order },
    payload: {
      type: "message",
      role,
      ...(phase ? { phase } : {}),
      content: [{ type: role === "user" ? "input_text" : "output_text", text }],
      internal_chat_message_metadata_passthrough: {
        content_item_kinds: [role === "user" ? "user.text" : "assistant.text"],
        create_time: 1_800_000_000 + order,
        turn_id: turnId,
      },
    },
  };
}

function transcriptJsonl(projectRoot, { extended = false } = {}) {
  const records = [
    {
      type: "session_meta",
      timestamp: "2026-09-27T01:00:00.000Z",
      payload: { id: SESSION_ID, cwd: projectRoot, cli_version: "0.999.0-test" },
    },
    { type: "turn_context", timestamp: "2026-09-27T01:00:00.500Z", payload: { model: "gpt-test" } },
    message({ role: "user", text: "첫 질문", order: 0, turnId: "turn-1" }),
    message({ role: "assistant", text: "진행", order: 1, phase: "commentary", turnId: "turn-1" }),
    message({ role: "assistant", text: "첫 답", order: 2, phase: "final_answer", turnId: "turn-1" }),
  ];
  if (extended) {
    records.push(
      message({ role: "user", text: "둘째 질문", order: 3, turnId: "turn-2" }),
      message({ role: "assistant", text: "둘째 답", order: 4, phase: "final_answer", turnId: "turn-2" }),
    );
  }
  return `${records.map((item) => JSON.stringify(item)).join("\n")}\n`;
}

function event(projectRoot, transcriptPath, hookEventName) {
  return {
    hook_event_name: hookEventName,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: projectRoot,
    ...(hookEventName === "Stop" ? { turn_id: "turn-1", stop_hook_active: false } : { reason: "other" }),
  };
}

function primaryInspection(projectRoot) {
  return async () => ({
    projectRoot,
    gitDir: path.join(projectRoot, ".git"),
    commonDir: path.join(projectRoot, ".git"),
    primary: true,
  });
}

async function setup(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "mogi-whiteboard-chat-archive-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const projectRoot = path.join(root, "project");
  const liveRoot = path.join(root, "live");
  const finalRoot = path.join(projectRoot, ".local", "chat-archive", "final");
  const transcriptPath = path.join(root, "rollout.jsonl");
  await mkdir(projectRoot, { recursive: true });
  await writeFile(transcriptPath, transcriptJsonl(projectRoot), "utf8");
  return { root, projectRoot, liveRoot, finalRoot, transcriptPath };
}

test("Stop writes only a live snapshot and SessionEnd finalizes it", async (t) => {
  const paths = await setup(t);
  const options = {
    ...paths,
    inspectWorktreeImpl: primaryInspection(paths.projectRoot),
    now: () => "2026-09-27T02:00:00.000Z",
  };

  assert.deepEqual(
    await archiveHookEvent(event(paths.projectRoot, paths.transcriptPath, "Stop"), options),
    { status: "archived", liveStatus: "created" },
  );
  assert.match(await readFile(path.join(paths.liveRoot, `${SESSION_ID}.md`), "utf8"), /ended_at: null/);
  await assert.rejects(access(paths.finalRoot), { code: "ENOENT" });

  assert.deepEqual(
    await archiveHookEvent(event(paths.projectRoot, paths.transcriptPath, "SessionEnd"), options),
    { status: "archived", liveStatus: "unchanged", finalStatus: "created" },
  );
  const [finalName] = await readdir(paths.finalRoot);
  assert.match(await readFile(path.join(paths.finalRoot, finalName), "utf8"), /ended_at: "2026-09-27T02:00:00.000Z"/);
});

test("repeated SessionEnd with a later time preserves the first final record", async (t) => {
  const paths = await setup(t);
  let time = "2026-09-27T02:00:00.000Z";
  const options = {
    ...paths,
    inspectWorktreeImpl: primaryInspection(paths.projectRoot),
    now: () => time,
  };
  const sessionEnd = event(paths.projectRoot, paths.transcriptPath, "SessionEnd");

  await archiveHookEvent(sessionEnd, options);
  const [finalName] = await readdir(paths.finalRoot);
  const first = await readFile(path.join(paths.finalRoot, finalName), "utf8");
  time = "2026-09-27T03:00:00.000Z";

  assert.deepEqual(await archiveHookEvent(sessionEnd, options), {
    status: "archived",
    liveStatus: "unchanged",
    finalStatus: "unchanged",
  });
  assert.equal(await readFile(path.join(paths.finalRoot, finalName), "utf8"), first);
});

test("events from another repository or linked worktree are skipped", async (t) => {
  const paths = await setup(t);
  const missingTranscript = path.join(paths.root, "missing.jsonl");
  const anotherRoot = path.join(paths.root, "another");
  await mkdir(anotherRoot, { recursive: true });

  assert.deepEqual(
    await archiveHookEvent(event(anotherRoot, missingTranscript, "Stop"), {
      ...paths,
      inspectWorktreeImpl: primaryInspection(anotherRoot),
      now: () => "2026-09-27T02:00:00.000Z",
    }),
    { status: "skipped" },
  );
  assert.deepEqual(
    await archiveHookEvent(event(paths.projectRoot, missingTranscript, "Stop"), {
      ...paths,
      inspectWorktreeImpl: async () => ({
        projectRoot: paths.projectRoot,
        gitDir: path.join(paths.projectRoot, ".git", "worktrees", "linked"),
        commonDir: path.join(paths.projectRoot, ".git"),
        primary: false,
      }),
      now: () => "2026-09-27T02:00:00.000Z",
    }),
    { status: "skipped" },
  );
  await assert.rejects(access(paths.liveRoot), { code: "ENOENT" });
});

test("invalid JSONL preserves the live snapshot and records a content-free error", async (t) => {
  const paths = await setup(t);
  const options = {
    ...paths,
    inspectWorktreeImpl: primaryInspection(paths.projectRoot),
    now: () => "2026-09-27T02:00:00.000Z",
  };
  const stop = event(paths.projectRoot, paths.transcriptPath, "Stop");

  await archiveHookEvent(stop, options);
  const livePath = path.join(paths.liveRoot, `${SESSION_ID}.md`);
  const before = await readFile(livePath, "utf8");
  await writeFile(paths.transcriptPath, `${transcriptJsonl(paths.projectRoot)}SECRET_TRUNCATED`, "utf8");

  await assert.rejects(archiveHookEvent(stop, options), (error) => error.code === "incomplete_jsonl");
  assert.equal(await readFile(livePath, "utf8"), before);
  const errorRecord = JSON.parse(await readFile(path.join(paths.liveRoot, `${SESSION_ID}.error.json`), "utf8"));
  assert.deepEqual(errorRecord, {
    schema_version: 1,
    session_id: SESSION_ID,
    hook_event_name: "Stop",
    error_code: "incomplete_jsonl",
    occurred_at: "2026-09-27T02:00:00.000Z",
  });
  assert.doesNotMatch(JSON.stringify(errorRecord), /SECRET_TRUNCATED|첫 질문|첫 답/);

  await writeFile(paths.transcriptPath, transcriptJsonl(paths.projectRoot), "utf8");
  assert.equal((await archiveHookEvent(stop, options)).liveStatus, "unchanged");
  await assert.rejects(access(path.join(paths.liveRoot, `${SESSION_ID}.error.json`)), { code: "ENOENT" });
});

test("a final conflict keeps the new live snapshot and old final record", async (t) => {
  const paths = await setup(t);
  const options = {
    ...paths,
    inspectWorktreeImpl: primaryInspection(paths.projectRoot),
    now: () => "2026-09-27T02:00:00.000Z",
  };
  const sessionEnd = event(paths.projectRoot, paths.transcriptPath, "SessionEnd");

  await archiveHookEvent(sessionEnd, options);
  const [finalName] = await readdir(paths.finalRoot);
  const finalPath = path.join(paths.finalRoot, finalName);
  const manuallyChanged = (await readFile(finalPath, "utf8")).replace("첫 답", "사람 수정");
  await writeFile(finalPath, manuallyChanged, "utf8");
  await writeFile(paths.transcriptPath, transcriptJsonl(paths.projectRoot, { extended: true }), "utf8");

  await assert.rejects(archiveHookEvent(sessionEnd, options), (error) => error.code === "body_hash_mismatch");
  assert.equal(await readFile(finalPath, "utf8"), manuallyChanged);
  assert.match(await readFile(path.join(paths.liveRoot, `${SESSION_ID}.md`), "utf8"), /둘째 답/);
  const errorRecord = await readFile(path.join(paths.liveRoot, `${SESSION_ID}.error.json`), "utf8");
  assert.match(errorRecord, /"error_code": "body_hash_mismatch"/);
  assert.doesNotMatch(errorRecord, /사람 수정|둘째 답/);
});

test("inspects primary and linked Git worktrees without changing them", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "mogi-whiteboard-chat-git-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const primaryRoot = path.join(root, "primary");
  const linkedRoot = path.join(root, "linked");
  const primaryNested = path.join(primaryRoot, "todo");
  const linkedNested = path.join(linkedRoot, "todo");
  await execFileAsync("git", ["init", primaryRoot]);
  await execFileAsync("git", ["-C", primaryRoot, "config", "user.name", "Test User"]);
  await execFileAsync("git", ["-C", primaryRoot, "config", "user.email", "test@example.com"]);
  await writeFile(path.join(primaryRoot, "README.md"), "fixture\n", "utf8");
  await execFileAsync("git", ["-C", primaryRoot, "add", "README.md"]);
  await execFileAsync("git", ["-C", primaryRoot, "commit", "-m", "fixture"]);
  await execFileAsync("git", ["-C", primaryRoot, "worktree", "add", "-b", "linked-test", linkedRoot]);
  await mkdir(primaryNested);
  await mkdir(linkedNested);

  const primary = await inspectWorktree(primaryNested);
  const linked = await inspectWorktree(linkedNested);

  assert.equal(primary.projectRoot, await realpath(primaryRoot));
  assert.equal(primary.primary, true);
  assert.equal(primary.gitDir, primary.commonDir);
  assert.equal(linked.projectRoot, await realpath(linkedRoot));
  assert.equal(linked.primary, false);
  assert.notEqual(linked.gitDir, linked.commonDir);
});

test("skips events started inside another repository subdirectory", async (t) => {
  const paths = await setup(t);
  const foreignRoot = path.join(paths.root, "foreign");
  const foreignNested = path.join(foreignRoot, "nested");
  await execFileAsync("git", ["init", foreignRoot]);
  await mkdir(foreignNested);

  assert.deepEqual(
    await archiveHookEvent(event(foreignNested, path.join(paths.root, "missing.jsonl"), "Stop"), paths),
    { status: "skipped" },
  );
  await assert.rejects(access(paths.liveRoot), { code: "ENOENT" });
});
