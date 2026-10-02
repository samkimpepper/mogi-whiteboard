# 2026-10-01 — mogi-productivity PR #10 데이터 흐름 😸🐾

상태: Whiteboard 작성 완료, 모기의 읽기·평가는 아직 전이다.

## 요청과 고정 기준

모기는 PR #10 Whiteboard를 요청하며 프론트·HTML 작업 설명을 제외하고 데이터 가공을 백엔드 관점으로 설명해 달라고 했다. GitHub PR이나 원본 구현을 새로 만들라는 요청이 아니다.

- PR: https://github.com/samkimpepper/mogi-productivity/pull/10
- 제목: Serve a local Things and chat status dashboard
- 조회 및 최종 확인 시 상태: OPEN
- base: `15b07272dbc7aa2c05edbdbfbba58e3d40cbb61b`
- head: `13a5c409b576b6b2085a7eff6acdc9c98c27123e`
- diff: 17 files, +680 / -2
- 임시 clone: `/private/tmp/mogi-productivity-pr10-whiteboard.jtilbn_a` (detached HEAD, 최종 Git 상태 clean)
- Whiteboard ID: `698dff95-527d-41c2-9229-ccc59ef49539`
- Whiteboard 제목: PR #10 — 데이터 수집·가공·갱신을 읽어보자옹 😸
- 최종 version: 51
- repositoryId: `515ba2ce-2728-4394-b09a-e01ccbdafb7e`
- 작성 중 GitHub head를 다시 확인했고 동일했다.

## 실제로 작성한 설명

- Things 허용 Area·프로젝트의 열린 항목 → 10열 텍스트 → ID·Area·날짜 검증 → 정규화된 todos 배열.
- chats metadata에서 역할별 최신 imported_at과 서울 달력 날짜 경과일 계산.
- STATE·현재 검토 경로·archive metadata에서 완료·기검토·시각 경계·중복을 처리해 세션 수 집계.
- inbox 공유 링크 문자열의 중복 제거와 개수.
- collectSnapshot 조립, generatedAt의 수집 시작 시각 의미, 저장소를 먼저 읽고 Things를 읽는 실행 순서.
- HTTP snapshot 제공, 진행 중 refresh Promise 공유, 설정·저장소 실패와 Things 부분 실패의 차이.
- 데이터 flow diagram과 CLI에서 시작하는 CALL TREE, 작은 고정 Markdown 코드 블록 7개.
- 화면·HTML·브라우저 필터와 export 구현 상세는 설명에서 제외했다. 기존 기본 7일 필터 등은 백엔드에서 계산한다고 오해하지 않도록 표시 경계만 짚었다.
- 7개 lens로 17개 파일을 모두 분류했으며 프론트·HTML/export는 별도 범위 제외 lens로 표시했다. 미분류 변경은 0이다.

## 직접 검증과 작성자 보고의 구분

다음 명령으로 백엔드 관련 자동 테스트 6개를 직접 실행해 통과·실패 0개를 확인했다.

```sh
node --test --test-name-pattern='reads dates|rejects disallowed|passes only|uses Seoul|review count|localhost refresh' integrations/things/test/open.test.js todo/dashboard/test/dashboard.test.js todo/dashboard/test/server.test.js
```

Things 입력 테스트 3개는 주입한 실행 함수를 사용했고, 가공 테스트 2개는 날짜·metadata와 임시 archive를 사용했다. HTTP 테스트 1개는 실제 임시 localhost 포트와 가상 collector를 사용했다. 실제 Things나 개인 archive 원문을 사용해 수집기를 실행하지 않았다. 프론트·DOM 테스트는 이번 실행 대상에서 제외했다.

Cubic 두 P2는 합성 fixture로 직접 확인했다. 허용된 non-hex suffix `ZZzz_--1`를 가진 검토 원문 링크는 `Current review has no source session IDs` 오류가 났다. 루틴 전용이라는 전제의 변경 프롬프트 1턴·기존 프롬프트 2턴 입력은 `count: 2`로 집계됐다. 실제 현재 개인 세션 수가 잘못됐다는 것까지 확인한 것은 아니다.

서버 테스트 정리 P3는 미완료 refresh의 연결을 가진 임시 HTTP 서버로 확인했다. `server.close()`만으로 종료가 완료되지 않았고 `closeAllConnections()` 후 완료됐다. 실제 CLI 종료 경로는 이미 이 함수를 호출하므로 테스트 정리와 구분했다. fixture 파일과 임시 서버는 검증 후 정리했다.

PR 작성자는 전체 132개 테스트 통과, 실제 Things 54개 읽기·localhost 서버·POST 갱신을 보고했다. 이번 독립 확인은 위 6개와 가상 반례 재현이며 작성자의 실제 앱 검증과 구분했다.

원문 범위 56개가 pinned 파일에 유효하고, 코드 발췌 7개가 원문과 정확히 일치함을 확인했다. 발췌 줄 수는 8·6·4·5·7·6·4다. CALL TREE의 CLI source가 처음에는 package.json 25행을 가리켜 확인 후 24행으로 교정했다. frame 직접 update와 head patch가 도구에서 거절돼 해당 CALL TREE component만 replace하고 다시 읽었다. 최종 staleSources는 0이다.

본문 전체를 다시 읽고 document/lenses lease를 종료했다. 생성 시 Desktop opened=true를 확인했으나 실제 화면의 코드 표시 범위는 독립 확인하지 않았다.

## Cubic과 trace 근거

PR review 본문·코드 줄 코멘트·일반 코멘트를 조회했다. 실제 작성 계정은 cubic-dev-ai[bot]이며 첫 리뷰는 373fe6d, 최근 리뷰는 고정 head 13a5c40을 대상으로 했다. 확인 시점에 작성자의 코멘트 답변은 없었다.

- 첫 리뷰: https://github.com/samkimpepper/mogi-productivity/pull/10#pullrequestreview-5376882204
- 최근 리뷰: https://github.com/samkimpepper/mogi-productivity/pull/10#pullrequestreview-5377044521
- non-hex suffix: https://github.com/samkimpepper/mogi-productivity/pull/10#discussion_r4153413898
- 루틴 집계: https://github.com/samkimpepper/mogi-productivity/pull/10#discussion_r4153413886
- 테스트 종료: https://github.com/samkimpepper/mogi-productivity/pull/10#discussion_r4153547549
- export 안내 P3: https://github.com/samkimpepper/mogi-productivity/pull/10#discussion_r4153547518 (요청 범위 밖이므로 Whiteboard에는 원문 링크만 표시)

백엔드 관련 세 지적은 유효성 확인·고정 head 수정 미반영으로 설명했다. 후속 대응의 할 일은 MAILBOX에 전달했으며 이 일지에 별도 대기 목록으로 쌓지 않는다.

head commit에는 `Agent-Session: 01a0f668-7ebc-7253-8552-3ba653322ffe`가 있었다. hosted trace list 조회는 `TraceStorageDeniedError: You cannot use this repository.`로 거절됐다. trace 없음으로 해석하거나 다른 경로로 우회하지 않았고 capture·권한·origin·업로드를 변경하지 않았다. 목적은 PR 본문을 근거로 설명했고 구현 에이전트의 당시 이유는 만들어내지 않았다.

## 관찰 상태

백엔드 위주 설명이라는 사용자 요청을 적용했다는 사실만 확인했다. 코드 이해·발췌 표시·그림의 효용은 읽기 소감 전까지 결론 내리지 않는다. PR #9는 version 76의 Cubic까지 읽기 완료 상태로 보존한다. 원본 저장소·PR·댓글·실제 앱·라이브 서버는 변경하지 않았다. 이번 결과 기록은 아직 커밋·푸시하지 않았다.
