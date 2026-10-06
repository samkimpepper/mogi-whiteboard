import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import path from "node:path";

async function existingBytes(filePath) {
  try {
    return await readFile(filePath);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function writeAtomicIfChanged(filePath, content) {
  const bytes = Buffer.from(content, "utf8");
  const existing = await existingBytes(filePath);
  if (existing?.equals(bytes)) {
    return "unchanged";
  }

  const directory = path.dirname(filePath);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const temporaryPath = path.join(directory, `.${path.basename(filePath)}.${process.pid}.${randomUUID()}.tmp`);
  let handle;
  try {
    handle = await open(temporaryPath, "wx", 0o600);
    await handle.writeFile(bytes);
    await handle.sync();
    await handle.close();
    handle = undefined;
    await rename(temporaryPath, filePath);
  } catch (error) {
    await handle?.close().catch(() => {});
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }

  return existing === null ? "created" : "updated";
}

function validatedSessionId(value) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(value)) {
    throw new Error("invalid_session_id");
  }
  return value;
}

export async function persistLiveArchive(artifact, { liveRoot }) {
  const sessionId = validatedSessionId(artifact.metadata?.session_id);
  return writeAtomicIfChanged(path.join(liveRoot, `${sessionId}.md`), artifact.markdown);
}

export async function persistArchiveError(
  { sessionId, hookEventName, errorCode, occurredAt },
  { liveRoot },
) {
  const validated = validatedSessionId(sessionId);
  const record = {
    schema_version: 1,
    session_id: validated,
    hook_event_name: hookEventName,
    error_code: errorCode,
    occurred_at: occurredAt,
  };
  return writeAtomicIfChanged(
    path.join(liveRoot, `${validated}.error.json`),
    `${JSON.stringify(record, null, 2)}\n`,
  );
}

export async function clearArchiveError(sessionId, { liveRoot }) {
  const validated = validatedSessionId(sessionId);
  try {
    await unlink(path.join(liveRoot, `${validated}.error.json`));
    return "removed";
  } catch (error) {
    if (error?.code === "ENOENT") {
      return "absent";
    }
    throw error;
  }
}

export class ArchiveConflictError extends Error {
  constructor(code) {
    super(`Whiteboard chat archive conflict: ${code}`);
    this.name = "ArchiveConflictError";
    this.code = code;
  }
}

function parseGeneratedRecord(markdown) {
  const match = /^---\n([\s\S]*?)\n---\n\n([\s\S]+)$/.exec(markdown);
  if (!match) {
    throw new ArchiveConflictError("missing_generated_metadata");
  }

  const values = new Map();
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(": ");
    if (separator === -1) {
      continue;
    }
    const key = line.slice(0, separator);
    const rawValue = line.slice(separator + 2);
    if (key === "session_id" || key === "content_sha256") {
      try {
        values.set(key, JSON.parse(rawValue));
      } catch {
        throw new ArchiveConflictError("missing_generated_metadata");
      }
    }
  }

  const sessionId = values.get("session_id");
  const declaredHash = values.get("content_sha256");
  if (typeof sessionId !== "string" || typeof declaredHash !== "string") {
    throw new ArchiveConflictError("missing_generated_metadata");
  }
  const actualHash = createHash("sha256").update(match[2]).digest("hex");
  if (actualHash !== declaredHash) {
    throw new ArchiveConflictError("body_hash_mismatch");
  }
  return { sessionId, contentHash: declaredHash };
}

function isInside(candidate, root) {
  const relative = path.relative(path.resolve(root), path.resolve(candidate));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export async function persistFinalArchive(
  artifact,
  { projectRoot, finalRoot = path.join(projectRoot, ".local", "chat-archive", "final") },
) {
  const sessionId = validatedSessionId(artifact.metadata?.session_id);
  if (
    typeof artifact.fileName !== "string"
    || path.basename(artifact.fileName) !== artifact.fileName
    || !artifact.fileName.endsWith(".md")
  ) {
    throw new ArchiveConflictError("invalid_file_name");
  }
  if (!isInside(finalRoot, projectRoot)) {
    throw new ArchiveConflictError("final_root_outside_project");
  }

  const destination = path.join(finalRoot, artifact.fileName);
  const existing = await existingBytes(destination);
  if (existing === null) {
    return writeAtomicIfChanged(destination, artifact.markdown);
  }

  const generated = parseGeneratedRecord(existing.toString("utf8"));
  if (generated.sessionId !== sessionId) {
    throw new ArchiveConflictError("session_id_mismatch");
  }
  if (generated.contentHash === artifact.metadata.content_sha256) {
    return "unchanged";
  }
  return writeAtomicIfChanged(destination, artifact.markdown);
}
