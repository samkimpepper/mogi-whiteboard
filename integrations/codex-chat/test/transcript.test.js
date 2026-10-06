import assert from "node:assert/strict";
import test from "node:test";

import {
  parseVisibleTranscript,
  TranscriptFormatError,
} from "../src/transcript.js";

const PROJECT_ROOT = "/Users/test/orca/mogi-whiteboard";
const SESSION_ID = "01a0fixture-session";

function record(type, payload, timestamp, metadata) {
  return {
    type,
    payload,
    timestamp,
    ...(metadata === undefined ? {} : { metadata }),
  };
}

function message({ role, text, order, timestamp, phase = undefined, turnId = "turn-1" }) {
  const contentType = role === "user" ? "input_text" : "output_text";
  return record(
    "response_item",
    {
      type: "message",
      role,
      ...(phase === undefined ? {} : { phase }),
      content: [{ type: contentType, text }],
      internal_chat_message_metadata_passthrough: {
        content_item_kinds: [role === "user" ? "user.text" : "assistant.text"],
        create_time: 1_800_000_000 + order,
        turn_id: turnId,
      },
    },
    timestamp,
    { client_authored: false, user_input_order: order },
  );
}

function jsonl(records, { trailingNewline = true } = {}) {
  return records.map((item) => JSON.stringify(item)).join("\n") + (trailingNewline ? "\n" : "");
}

function validRecords() {
  return [
    record(
      "session_meta",
      {
        id: SESSION_ID,
        cwd: PROJECT_ROOT,
        cli_version: "0.999.0-test",
        creator_account_id: "SECRET_ACCOUNT",
      },
      "2026-09-27T01:00:00.000Z",
    ),
    record(
      "response_item",
      {
        type: "message",
        role: "developer",
        content: [{ type: "input_text", text: "SECRET_DEVELOPER" }],
      },
      "2026-09-27T01:00:00.100Z",
    ),
    record(
      "response_item",
      {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: "SECRET_INJECTED_USER" }],
        internal_chat_message_metadata_passthrough: {
          content_item_kinds: ["system.agents"],
          create_time: 1_800_000_000,
          turn_id: "injected",
        },
      },
      "2026-09-27T01:00:00.200Z",
    ),
    record("response_item", { type: "reasoning", text: "SECRET_REASONING" }, "2026-09-27T01:00:00.300Z"),
    message({ role: "assistant", text: "완료", order: 2, phase: "final_answer", timestamp: "2026-09-27T01:00:03.000Z" }),
    record("response_item", { type: "custom_tool_call_output", output: "SECRET_TOOL" }, "2026-09-27T01:00:02.500Z"),
    message({ role: "user", text: "안녕\n", order: 0, timestamp: "2026-09-27T01:00:01.000Z" }),
    record("turn_context", { model: "gpt-test-model" }, "2026-09-27T01:00:01.100Z"),
    message({ role: "assistant", text: "진행 중", order: 1, phase: "commentary", timestamp: "2026-09-27T01:00:02.000Z" }),
  ];
}

test("extracts only visible user and assistant messages in display order", () => {
  const result = parseVisibleTranscript(jsonl(validRecords()), {
    sessionId: SESSION_ID,
    projectRoot: PROJECT_ROOT,
  });

  assert.deepEqual(result, {
    sessionId: SESSION_ID,
    startedAt: "2026-09-27T01:00:01.000Z",
    updatedAt: "2026-09-27T01:00:03.000Z",
    cliVersion: "0.999.0-test",
    model: "gpt-test-model",
    messages: [
      {
        order: 0,
        role: "user",
        phase: null,
        text: "안녕\n",
        turnId: "turn-1",
        timestamp: "2026-09-27T01:00:01.000Z",
      },
      {
        order: 1,
        role: "assistant",
        phase: "commentary",
        text: "진행 중",
        turnId: "turn-1",
        timestamp: "2026-09-27T01:00:02.000Z",
      },
      {
        order: 2,
        role: "assistant",
        phase: "final_answer",
        text: "완료",
        turnId: "turn-1",
        timestamp: "2026-09-27T01:00:03.000Z",
      },
    ],
  });

  const serialized = JSON.stringify(result);
  assert.doesNotMatch(serialized, /SECRET_ACCOUNT|SECRET_DEVELOPER|SECRET_INJECTED_USER|SECRET_REASONING|SECRET_TOOL/);
});

function assertFormatCode(action, code) {
  assert.throws(action, (error) => {
    assert.ok(error instanceof TranscriptFormatError);
    assert.equal(error.code, code);
    assert.doesNotMatch(error.message, /SECRET_|Users\/test/);
    return true;
  });
}

test("rejects invalid and incomplete JSONL without echoing source content", () => {
  assertFormatCode(
    () => parseVisibleTranscript('{"type":"session_meta","payload":"SECRET_BROKEN"}\nnot-json\n', {
      sessionId: SESSION_ID,
      projectRoot: PROJECT_ROOT,
    }),
    "invalid_jsonl",
  );

  assertFormatCode(
    () => parseVisibleTranscript(jsonl(validRecords(), { trailingNewline: false }), {
      sessionId: SESSION_ID,
      projectRoot: PROJECT_ROOT,
    }),
    "incomplete_jsonl",
  );
});

test("rejects a different session or a cwd outside the project", () => {
  assertFormatCode(
    () => parseVisibleTranscript(jsonl(validRecords()), {
      sessionId: "another-session",
      projectRoot: PROJECT_ROOT,
    }),
    "session_mismatch",
  );

  const outside = structuredClone(validRecords());
  outside[0].payload.cwd = "/Users/test/other-project";
  assertFormatCode(
    () => parseVisibleTranscript(jsonl(outside), {
      sessionId: SESSION_ID,
      projectRoot: PROJECT_ROOT,
    }),
    "cwd_outside_project",
  );
});

test("rejects duplicate and non-numeric visible message order", () => {
  const duplicate = validRecords();
  duplicate.push(message({
    role: "assistant",
    text: "duplicate",
    order: 2,
    phase: "final_answer",
    timestamp: "2026-09-27T01:00:04.000Z",
  }));
  assertFormatCode(
    () => parseVisibleTranscript(jsonl(duplicate), { sessionId: SESSION_ID, projectRoot: PROJECT_ROOT }),
    "duplicate_message_order",
  );

  const nonNumeric = structuredClone(validRecords());
  const visibleUser = nonNumeric.find((item) => item.metadata?.user_input_order === 0);
  visibleUser.metadata.user_input_order = "0";
  assertFormatCode(
    () => parseVisibleTranscript(jsonl(nonNumeric), { sessionId: SESSION_ID, projectRoot: PROJECT_ROOT }),
    "invalid_message_order",
  );
});

test("rejects unknown visible phases and content types", () => {
  const unknownPhase = structuredClone(validRecords());
  const commentary = unknownPhase.find((item) => item.metadata?.user_input_order === 1);
  commentary.payload.phase = "analysis";
  assertFormatCode(
    () => parseVisibleTranscript(jsonl(unknownPhase), { sessionId: SESSION_ID, projectRoot: PROJECT_ROOT }),
    "unknown_assistant_phase",
  );

  const wrongContent = structuredClone(validRecords());
  const visibleUser = wrongContent.find((item) => item.metadata?.user_input_order === 0);
  visibleUser.payload.content = [{ type: "input_image", image_url: "SECRET_IMAGE" }];
  assertFormatCode(
    () => parseVisibleTranscript(jsonl(wrongContent), { sessionId: SESSION_ID, projectRoot: PROJECT_ROOT }),
    "invalid_message_content",
  );
});

test("requires a real visible user message", () => {
  const noUser = validRecords().filter((item) => item.metadata?.user_input_order !== 0);
  assertFormatCode(
    () => parseVisibleTranscript(jsonl(noUser), { sessionId: SESSION_ID, projectRoot: PROJECT_ROOT }),
    "missing_user_message",
  );
});

test("ignores unrelated unknown non-message records", () => {
  const records = validRecords();
  records.push(record("future_record", { schema: "unknown", text: "SECRET_FUTURE" }, "2026-09-27T01:00:05.000Z"));

  const result = parseVisibleTranscript(jsonl(records), {
    sessionId: SESSION_ID,
    projectRoot: PROJECT_ROOT,
  });

  assert.equal(result.messages.length, 3);
  assert.doesNotMatch(JSON.stringify(result), /SECRET_FUTURE/);
});
