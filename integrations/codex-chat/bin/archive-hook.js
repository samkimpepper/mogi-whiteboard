#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";

import { archiveHookEvent } from "../src/archive.js";

const MODULE_PATH = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(MODULE_PATH), "../../..");
const GENERIC_ERROR = "whiteboard-chat-archive: failed; see the local error record\n";

async function readStream(stream) {
  let input = "";
  for await (const chunk of stream) {
    input += chunk.toString();
  }
  return input;
}

export async function main({
  stdin = process.stdin,
  stdout = process.stdout,
  stderr = process.stderr,
  archiveHookEventImpl = archiveHookEvent,
  projectRoot = PROJECT_ROOT,
  ...archiveOptions
} = {}) {
  let event;
  try {
    event = JSON.parse(await readStream(stdin));
    await archiveHookEventImpl(event, { projectRoot, ...archiveOptions });
    stdout.write("{}\n");
    return 0;
  } catch {
    if (event?.hook_event_name === "Stop") {
      stdout.write(`${JSON.stringify({
        systemMessage: "Whiteboard chat archive failed; see the local error record.",
      })}\n`);
      return 0;
    }
    stderr.write(GENERIC_ERROR);
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === MODULE_PATH) {
  process.exitCode = await main();
}
