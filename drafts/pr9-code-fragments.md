# PR #9 — 필요한 코드 조각으로 바꾸는 수정안

Whiteboard에는 아직 적용하지 않았다. 이 세션의 Whiteboard MCP 호출은 승인이 필요하다는 이유로 거절됐으며 approval policy가 never여서 직접 변경할 수 없다.

마지막으로 읽은 리뷰는 version 32다. 적용하는 세션은 현재 리뷰를 다시 읽고 아래 ID와 원문 범위를 확인한 뒤 새 document lease로 수정해야 한다. 기존 설명과 작성자의 판단 근거는 유지한다.

세 code_peek을 원문에서 추출한 고정 Markdown 코드 블록으로 교체한다. 원문 위치는 별도 링크로 남긴다. 링크를 클릭했을 때 파일 전체가 열리는 앱 동작까지 바꾸는 수정은 아니다.

## 실행할 프로그램과 인자 — 6줄

교체 대상: `block-34`. 확인한 원문: `integrations/routine/src/launchd.js:66-71`.

```javascript
    '  <key>ProgramArguments</key>',
    '  <array>',
    stringNode(nodePath),
    stringNode(scriptPath),
    stringNode("--apply"),
    '  </array>',
```

[원문: integrations/routine/src/launchd.js 66–71행](review-source:head/integrations/routine/src/launchd.js#L66-L71)

## 예약 시각 — 7줄

교체 대상: `block-36`. 확인한 원문: `integrations/routine/src/launchd.js:79-85`.

```javascript
    '  <key>StartCalendarInterval</key>',
    '  <dict>',
    '    <key>Hour</key>',
    `    <integer>${hour}</integer>`,
    '    <key>Minute</key>',
    `    <integer>${minute}</integer>`,
    '  </dict>',
```

[원문: integrations/routine/src/launchd.js 79–85행](review-source:head/integrations/routine/src/launchd.js#L79-L85)

## 설정 파일 이동과 macOS 등록 — 5줄

교체 대상: `block-39`. 확인한 원문: `integrations/routine/bin/holiday-schedule.js:201-205`.

```javascript
    await rename(temporaryPath, paths.plistPath);
    await execFileAsync("/bin/launchctl", ["bootstrap", `gui/${uid}`, paths.plistPath], {
      encoding: "utf8",
      timeout: 10_000,
    });
```

[원문: integrations/routine/bin/holiday-schedule.js 201–205행](review-source:head/integrations/routine/bin/holiday-schedule.js#L201-L205)

## 적용 후 확인

본문에 각각 6·7·5줄만 보이는지 실제 화면에서 확인한다. 주변 설명과 원문 링크가 유지되는지도 확인한 뒤 document lease를 종료하고 새 version을 기록한다.
