import { execFile } from "node:child_process";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { renderWhiteboardChatArchive } from "./render.js";
import {
  clearArchiveError,
  persistArchiveError,
  persistFinalArchive,
  persistLiveArchive,
} from "./storage.js";
import { parseVisibleTranscript } from "./transcript.js";

const execFileAsync = promisify(execFile);

async function gitOutput(cwd, args) {
  const { stdout } = await execFileAsync("git", args, { cwd, encoding: "utf8" });
  return stdout.trim();
}

export async function inspectWorktree(cwd) {
  const projectRoot = await realpath(path.resolve(await gitOutput(cwd, ["rev-parse", "--show-toplevel"])));
  const gitDir = await realpath(path.resolve(await gitOutput(cwd, ["rev-parse", "--absolute-git-dir"])));
  const commonRaw = await gitOutput(cwd, ["rev-parse", "--git-common-dir"]);
  const commonDir = await realpath(path.resolve(cwd, commonRaw));
  return {
    projectRoot,
    gitDir,
    commonDir,
    primary: gitDir === commonDir,
  };
}

function archiveError(code) {
  const error = new Error(`Whiteboard chat archive error: ${code}`);
  error.code = code;
  return error;
}

function validateEvent(event) {
  if (!event || (event.hook_event_name !== "Stop" && event.hook_event_name !== "SessionEnd")) {
    throw archiveError("unsupported_hook_event");
  }
  if (typeof event.session_id !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(event.session_id)) {
    throw archiveError("invalid_session_id");
  }
  if (typeof event.transcript_path !== "string" || event.transcript_path.length === 0) {
    throw archiveError("missing_transcript_path");
  }
  if (typeof event.cwd !== "string" || event.cwd.length === 0) {
    throw archiveError("missing_cwd");
  }
}

function safeErrorCode(error) {
  return typeof error?.code === "string" && /^[a-z0-9_]+$/.test(error.code)
    ? error.code
    : "archive_failed";
}

export async function archiveHookEvent(
  event,
  {
    projectRoot,
    liveRoot = path.join(projectRoot, ".local", "chat-archive", "live"),
    finalRoot = path.join(projectRoot, ".local", "chat-archive", "final"),
    now = () => new Date().toISOString(),
    inspectWorktreeImpl = inspectWorktree,
    readFileImpl = readFile,
  } = {},
) {
  validateEvent(event);
  const inspected = await inspectWorktreeImpl(event.cwd);
  const [inspectedRoot, expectedRoot] = await Promise.all([
    realpath(path.resolve(inspected.projectRoot)),
    realpath(path.resolve(projectRoot)),
  ]);
  if (!inspected.primary || inspectedRoot !== expectedRoot) {
    return { status: "skipped" };
  }

  const occurredAt = now();
  try {
    const jsonl = await readFileImpl(event.transcript_path, "utf8");
    const transcript = parseVisibleTranscript(jsonl, {
      sessionId: event.session_id,
      projectRoot,
    });
    const liveArtifact = renderWhiteboardChatArchive(transcript);
    const liveStatus = await persistLiveArchive(liveArtifact, { liveRoot });
    let finalStatus;

    if (event.hook_event_name === "SessionEnd") {
      const finalArtifact = renderWhiteboardChatArchive(transcript, { endedAt: occurredAt });
      finalStatus = await persistFinalArchive(finalArtifact, { projectRoot, finalRoot });
    }

    await clearArchiveError(event.session_id, { liveRoot });
    return {
      status: "archived",
      liveStatus,
      ...(finalStatus === undefined ? {} : { finalStatus }),
    };
  } catch (error) {
    await persistArchiveError(
      {
        sessionId: event.session_id,
        hookEventName: event.hook_event_name,
        errorCode: safeErrorCode(error),
        occurredAt,
      },
      { liveRoot },
    );
    throw error;
  }
}
