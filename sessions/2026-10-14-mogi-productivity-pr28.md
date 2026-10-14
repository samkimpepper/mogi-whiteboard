# PR28 — 모든 Area·Area 없는 Things 할 일 😸

투두냥의 요청 `msg_84c92cf32261`은 모기가 현재 PR Whiteboard를 요청했다고 전했다. 현재 화이트보드냥은 독립 diff·코드·검증을 먼저 만들고, 작성 뒤 기존 DECISIONS 규칙대로 보충을 요청했다. 실제 세션 종료·커밋·푸시 요청은 아니다.

## 독립 작성과 대상

- 리뷰 `6b3d9c52-acda-44ac-9b9e-c5e14209174c`, **v25**, 제목 `PR28 — Area 없이도 Things 할 일을 읽고 쓰기 😸`.
- base `de387a5805ccd2a1fd04137e7a7931762d45235e`·head `092dc8d9fbb25b0dbde7d1d472e7f923224294ba`. 최종 GitHub PR28 OPEN/MERGEABLE/CLEAN·동일head. API baseRef는 `2d62f2d2ef886f6f1c884cb1d18d61caf6bf67dd`이며 실제 공통 조상은 고정base, PR 변경42파일이다.
- 별도 detached clone `/var/folders/p6/y64bglj97j33bfmv8v9d3vd80000gn/T/mogi-pr28-whiteboard-fblfz8lq`에서 독립 확인했다. 원본 제품 repo·PR·댓글·개인 Things·상대 주소는 변경하지 않았다.
- 사용자 사건·전후 표 → T44 기록 요약 → 가상 장보기의 null/빈 인자/제목 선택 → 생성/저장값 확인 → 조회·설정·연동 → Cubic/Codex → 구체 시험/실제 보고로 썼다. 그림1·CALL TREE1·원문 발췌4개다. 요구 원문을 직접 확인한 것으로 쓰지 않았다.
- Authoring 안내가 명시적으로 요구한 렌즈 담당만 생성했다. 렌즈9개/42파일·미분류0; 본문40노드/고유source47범위 유효·발췌4개가 고정Git 원문과 정확히 일치했다. 전체 readback·문자 오타 정정·확인근거 defaultCollapsed=true·두 lease 종료/workingCount0 확인.
- Desktop create/open·app pick 응답 성공이다. 실제 화면의 코드 크기·레이아웃은 독립 미확인이다. 공유 snapshot 업로드·공개 링크 생성은 하지 않았다.

## 확인한 구현과 경계

Area를 생략한 입력은 validateTodo에서 null, Mac title selector에는 빈 문자열이다. Area도 프로젝트도 없는 정확한 제목의 열린 항목 한 개만 reuse하고, 없으면 create, 여러 개면 중단한다. Area를 지정하면 그 Area와 그 Area의 프로젝트가 제목 조회 대상이다. 정확한 ID의 일반 수정은 모든 Area·Area 없음의 열린 항목을 다룬다.

체크리스트 없는 날짜만 create에 명시적 `set area of targetToDo to targetArea`를 복원했다. reuse에는 부모 setter가 없다. Notes 생략 보존/명시 교체/빈 문자열 비우기·시각/체크리스트의 별도 생성 경로를 유지한다. 지정 Area와 실제 readback Area가 다르면 날짜·Notes 비교로 넘어가지 않고 `savedValues: unavailable`이다. 테스트 이름의 mismatch와 실제 unavailable assert를 구분했다. verified는 대상·날짜·Notes 조회 결과이지 알림 시각·통지·폰 동기화 보장이 아니다.

전체 열린 조회는 먼저 목록을 받아 반복한다. Area 없는 빈 칸은 parser의 null을 거쳐 화면·복사·Pending·필터의 Area 없음이 된다. timeout60초와 구현자의 약17초 실측 보고를 구분했다. allowedAreas는 표시/이름→ID 목록이며 routine·house-intake는 기존 명시 목표Area, study는 studyArea·주말 검사다. 과거 잘못 Area 없이 생긴 항목을 옮기는 기능은 없다.

## 독립 검증

- `pnpm install --frozen-lockfile --ignore-scripts` 뒤 `pnpm test`: **241/241·skip0**, 로그 `/tmp/mogi-pr28-whiteboard-tests.log`.
- 문서 영향검사 고정base→head42경로/경고0·`git diff --check` 통과. 문서 내용 정확성 검사는 별개다.
- 현재 notes-applescript 회귀 테스트를 별도 임시폴더에서 현재head/base/head의 Area setter 제거에 각각 적용했다. 현재 통과, base 실패, setter 제거 실패다. 각각 `/var/folders/p6/y64bglj97j33bfmv8v9d3vd80000gn/T/mogi-pr28-area-recheck-sq4t7n35`, `mogi-pr28-area-recheck-xupa9cr5`, `mogi-pr28-area-recheck-85bsh1bg`의 `result.log`에 결과를 남겼다(뒤 두 폴더도 같은 부모경로). 원본파일을 변조하지 않았다.
- 변경 AppleScript7개 `osacompile` 통과·reminder.swift `xcrun swiftc -typecheck` 통과. 실제 앱 명령을 실행한 결과가 아니다.
- 소스47고유범위·작은 원문발췌4개 대조, 구성40노드 ID 중복0, 렌즈9/42파일 미분류0을 확인했다.

## 리뷰·실제 사용 보고·trace

Cubic의 실제 계정 `cubic-dev-ai[bot]` P3 [원문](https://github.com/samkimpepper/mogi-productivity/pull/28#discussion_r4266063792)을 확인했다. README148의 일반 명령/study 예외 수정과 현재 study 코드의 일치를 확인했다. Codex [리뷰](https://github.com/samkimpepper/mogi-productivity/pull/28#pullrequestreview-5512313067)의 null 표시P2는 현재 코드/가상 DOM 테스트로 수정·검증 확인이다. [구현자 답변](https://github.com/samkimpepper/mogi-productivity/pull/28#pullrequestreview-5512336286)의 봇 영어 요약 보존 보고와 최종 실제 PR본문에 그 블록이 없는 상태를 구분했다.

동일head [UAT1·2](https://github.com/samkimpepper/mogi-productivity/pull/28#issuecomment-6159491745), 이후 [UAT3](https://github.com/samkimpepper/mogi-productivity/pull/28#issuecomment-6159541827)는 모기가 위임한 투두냥의 보고다. Area 없는 같은ID reuse·날짜/Notes verified·Today 포함·지정Area 날짜만 생성의 정확한ID Area 재조회 PASS를 설명했다. 개인값은 복제하지 않았고, 화이트보드냥의 새 실기기 실행·전체수정명령/Area없는새생성/폰/알림 통지 확인으로 확대하지 않았다. PR 본문도 현황판 화면 UAT는 미실행으로 명시했다.

구현 commit의 세션 `b99841bc-6114-4d70-b5a1-03d2f0c21089`를 hosted trace list/pull로 조회했다. 인증 오류는 없었고 unavailable·events0/files0/paths[]라서 실제 원문을 확인하지 못했다. FFF 도구도 없었다. 설정/인증/업로드를 변경하지 않고 고정 T44·PR·실제 작업계약 기록의 요약으로 쓰며 모기 원문 인용을 만들지 않았다.

## 통신·남은 확인

자기 caller/기존Run을 유지해 시작register/resolve를 수행했다. 보충 직전 자기resolve/Run·상대 제공주소와 실제Run generation1/terminal incarnation/runtime/Claude/connected/writable을 다시 대조했다.

본문 재확인과 모든 lease 종료 뒤 MAILBOX에 선택 이유·빠진 문맥의 보충 요청을 추가했다. 12:00:06 KST `msg_4c4e6d2b6398` 한 번 enqueue, 응답delivered_at null·수신/보충 완료 미확인이다. 원 delivery ACK 완료·남은inbox0. [통신 정본](../communication/log/2026-10-14-02-pr28-supplement-request.md).

모기의 읽기·이해·설명 반응은 아직 없다. PR17 파일럿을 자동 재적용하지 않았으며 후속 질문은 기존 요청대로 채팅에서 답한다. 커밋/푸시·세션 종료는 수행하지 않았다.

## 구현 문맥 보충 완료 확인 — v29

회신 `msg_2c6f84e12c44` 뒤 현재API **v29**와 보존v25를 전체 대조했다. pins·렌즈 동일, 기존40노드·원문발췌4·표/예시/그림/검증/접힌근거는 내용·순서가 같다. ③ 뒤 callout51/문단52의 회귀 발견 경과와 ⑤ 뒤 callout53/문단54의 조회시간·이름→ID 목록 배경만 추가됐다.

PR27의 확인실패→1초 timeout 가설→실측기각→ID 조회 Area none은 투두냥의 현재회고 보고다. 구현 작업자가 직접 확인했다는 8be5cba의 삭제/Notes 조건 diff는 화이트보드냥도 실제Git에서 그대로 확인했고 추가 발췌가 정확히 일치했다. 추가6개 source범위·base30초/head60초·findThingsArea·snapshot areas·filter·config주석을 직접 대조했다. 86개/약17초는 투두냥실측 보고, 2배여유·설정키 유지의 이유는 작업자추론으로 남겨 실제사용자선택/당시원문으로 확대하지 않았다.

현재PR OPEN·같은head, 실제MAILBOX0바이트다. 두callout/두문단 추가4노드로 총44노드이며 새코드/새시험 결과가 추가된 것이 아니므로 기존241/skip0 검증을 유지하고 반복하지 않았다. lease 종료는 보충자의 보고다. 발신은 대표가 아닌 제품feature의 Claude작업자이고 조회시 operator_close 상태였으며, 대표주소를 바꾸거나 종료터미널에 답장하지 않았다. 독립대조 뒤 delivery ACK·inbox0, 자세한 통신은 연결된 정본로그를 따른다. 모기읽기/이해·새UAT·원본변경·커밋/푸시·세션종료는 없다.

## 읽기 질문 — 다른 생성 경로와 명령 구분

모기가 읽는 중이라고 알리고 시각·체크리스트가 있을 때 다른 생성 경로를 쓴다는 문장이 다른 명령을 뜻하는지 물었다. 고정head의 write.js 분기·upsert AppleScript·reminder.swift·native helper를 다시 읽었다. 같은 터미널 명령 things:add가 옵션에 따라 날짜만/체크리스트/시각의 내부 경로를 고르는 것이며, 날짜만·체크리스트없음의 새생성은 AppleScript make new to do, 날짜만·체크리스트의 새생성은 AppleScript open location으로 things:///add, 시각 요청은 Swift helper로 Things전용 add/update 주소를 전달한다고 채팅에서 구분한다. 설명표는 새생성으로 범위를 고정하고 기존항목 재사용과 혼동하지 않는다. 같은Controller가 옵션에 따라 다른 처리 경로를 고르는 Spring 비유로 연결한다. 실제 명령 실행/새시험/Whiteboard편집/MAILBOX/통신 변경은 없으며 v29 유지다. 답변의 이해·전체읽기 완료는 아직 확인되지 않았다.

## 표 선호 피드백·작은 조건이 다른 처리 경로가 되는 이유

모기가 표로 작성해줘서 매우 좋다고 직접 밝혔다. 무엇이 도움됐는지 이미 표를 특정했으므로 다시 평가 질문을 하지 않는다. 직전 명령/내부경로 비교 표의 표현 선호이며 전체PR 이해로 확대하지 않는다.

이어 작은 조건 차이인데 왜 생성 메커니즘이 크게 달라지는지 물었다. Things 공식 URL/AppleScript 안내와 설치된 Things.sdef(앱이 제공하는 AppleScript 명령·속성 목록), 고정 README·날짜동작 설계시험 보고를 읽었다. 설치 dictionary에는 reminder/checklist 정의가 없고 URL에는 when 날짜·시각 및 checklist-items가 있다. 사용자에게는 같은 장보기 요청이지만 알림시각·체크리스트라는 추가 기능을 제공하는 앱명령 경로가 필요해지는 것으로 설명한다. Swift 자체가 시간입력의 필수언어라는 뜻은 아니며 현재코드의 토큰/URL 메모리 처리 선택으로 구분한다. 날짜도 URL 생성이 가능하므로 모든 분기가 플랫폼상 강제된다고 단정하지 않는다. 기존날짜 AppleScript 유지와 한항목의 알림보존 관측을 연결하되 해당시험을 새로 실행하지 않았다. v29·채팅답변 유지, 코드/본문/개인앱/MAILBOX/통신 변경·새구현결정은 없다. 후속답의 이해·전체읽기 완료는 미확인이다.

## 시각 경로의 기존 항목 수정 범위 — 요구와 구현 선택 구분

모기는 시각 경로가 기존 항목 수정도 맡은 이유가 플랫폼상 필수인지, 자신이 처음 기존 항목의 시각 변경을 요구해서 굳어진 것인지 물었다. ctx 검색 뒤 실제 이벤트를 열어 PR23 착수 당시를 대조했다. Codex ctx 세션 `b016de4d`/provider `01a12f5b-0a44-7821-88b6-e4d55d07e251`, user event `7655094c`(2026-10-12 18:34:55 KST)는 시각 알림 브리지를 우선하고 매번 직접 설정하는 수고를 줄이려는 요청이다. 특정 언어/내부경로를 지정한 발화가 아니다. assistant event `fe9346e8`(18:36:50)은 투두냥이 범위를 새 할 일 시각 설정+기존 같은 ID의 알림 추가/변경으로 구체화한 답변이다. event `10f5da58`(18:41:16)은 같은 범위의 작업 시작 보고다. 이 이벤트들만으로 모기가 최초로 기존항목 수정을 직접 명시한 발화라고 소급하지 않는다.

당시 실제 구현지시에는 기존ID 수정도 포함하고 URL update를 우선하며 토큰을 native 메모리에서 다루라는 계약이 있었다. 현재 requestReminder와 최초8a4a87a의 create/reuse 선택·reminder.swift의 /add 또는 /update 분기를 대조했다. 기존 항목이면 같은ID를 update하고 없으면 add하는 범위이며, 기존 ID를 재사용해 중복 생성을 피하는 요구와 구현 언어의 선택을 구분한다. AppleScript 공개 명령에는 reminder가 없지만 Swift 자체는 필수언어가 아니고, 공식 Shortcuts의 Reminder Time 수정이라는 별도 지원경로도 있다. 현재브리지는 그 경로를 구현하지 않았다. 후속 구현/마이그레이션 결정·Whiteboard편집·MAILBOX 전달·메시지전송·새시험은 없으며 v29 유지다. 원문 조회는 읽기만 수행했고 개인항목 내용을 기록소로 복제하지 않았다.

모기는 기존 항목 수정이 아니라 처음부터 시각을 넣는 새 생성도 현재 Swift를 거치는지 후속 질문했다. 고정head write.js88~96의 시각조건→requestReminder, reminder.js65~68의 조회→create/reuse,80~87의 공통native호출, reminder.swift100~104의 /add 또는 /update 선택을 다시 읽었다. 현재는 시각입력부터 공통경로를 고르므로 새생성도Swift이며, 새생성의토큰불필요와 기존수정의토큰필요를 구분한다. 이 구분이 Swift라는 언어 자체의필수성을 뜻하지 않는다고 답한다. 코드/문서본문/개인앱/통신·새시험 변경은 없고 v29 유지다.

모기는 Swift를 통하는 이유가 인증토큰 때문인지 확인했다. 당시 계약의 기존ID URL update·전용Keychain·토큰 포함URL을 native메모리 안에서 처리하는 조건을 근거로 그 연결이 맞다고 답한다. 기존수정의 비밀값보관/메모리전달이 Swift 선택의 중요한 이유이고, 토큰없는새생성도 동일helper를 사용하는 현재코드구조와 구분한다. Swift만 가능한기술이라고 단정하지 않으며 사용자확인질문을 전체PR이해완료로 처리하지 않는다. 추가조사/본문편집/실행/통신 변경은 없다.

모기는 요구사항을 대충 줬기 때문인지, 수정이면 모두Swift로 보내고 생성/수정/삭제로 나누어야 하는지 물었다. 고정head write.js와 reminder.swift 및 upsert-todo.applescript를 다시 읽었다. 앞선 설명의 '기존수정에는토큰필요'는 Things URL /update를 사용하는 수정에 한정된다고 명확히 정정한다. 날짜/Notes 수정은 현재 AppleScript로 토큰 없이 수행하고, 시각수정은 Swift에서 URL /update와 토큰을 사용하며, 시각새생성은 같은Swift의 /add를 쓰되 토큰이 없다. 사용자 동작의 생성/수정/삭제 구분과 필드지원·전달경로 선택은 다른 축이며 분리해 표현하는 설계는 타당하나 모든수정Swift라는 결론은 아니다. 삭제구현/경로를 추정하지 않는다. 최초사용자요청이 언어를 지정하지 않은 점에 비추어 사용자탓으로 돌리지 않는다. 채팅설명만 수행하며 Whiteboard v29·제품코드·통신은 그대로다.

모기는 직전 표대로 구분하는 방향을 질문하고 URL update가 필요한 동작 조사를 MAILBOX에 적어달라고 직접 요청했다. 생성·수정·삭제와 변경값·실제명령·토큰요부를 함께 표로 정리하는 방향을 권하며, 공식지원과 필수사용·공식대안·현재구현을 구분하는 조사요청을 MAILBOX에 추가하고 본문을 재확인했다. 이는 조사·설계검토 전달이며 구현변경 결정은 아니다. 일반 MAILBOX 요청이므로 새 Whiteboard 작성 후 보충요청의 신호 예외를 적용하지 않고 Orca 메시지는 보내지 않았다. 할 일의 정본은 MAILBOX이며 이 기록에 별도 대기목록을 만들지 않는다. Whiteboard v29·제품코드는 변경하지 않았고 git diff --check 통과다.

모기는 Things 명령이 호출되는 흐름의 표를 원본 integrations 아래에 임시로 두고 당분간 계속 감시·검토하다 안정·불필요 시 삭제하겠다고 요청했다. 역할 경계에 따라 원본을 직접 편집하지 않고 기존 MAILBOX 조사요청 뒤에 문서작성·관련코드변경시 대조/갱신 요청을 추가했다. 현재동작과 제안설계 구분, 터미널명령부터 함수·실행스크립트·Things명령까지의 연결, 조건별분기·preview/apply·ID재사용·토큰요부·근거를 표에 포함하도록 전달했다. 지속검토는 관련작업 절차로 해석했으며 상시자동화 승인으로 확대하지 않았다. 메시지전송·Whiteboard편집·원본변경·커밋/푸시는 수행하지 않았다. 요청의 정본은 MAILBOX이고 원본표 작성완료나 수신완료로 기록하지 않는다.

모기는 ②의 “Area 생략 제목 재사용의 대상에서는 빠진다” 문장을 이해하지 못했다고 밝혔다. 현재 v29 block31 앞뒤와 고정head read-reminder-target.applescript·reminder.js·things-add.js를 읽었다. 문장의 대상은 Area 없는 프로젝트 안의 할 일이며, 제목재사용은 이름만 복사한다는 뜻이 아니라 기존같은제목항목의 ID를 재사용해 수정하는 뜻이라고 채팅에서 풀어 설명한다. 가상 장보기 항목의 Area/프로젝트 소속을 표로 비교하고, Area생략 제목조회는 미완료·제목일치·Area없음·프로젝트없음 조건임을 명시한다. 프로젝트안항목만 있다면 그것을 건드리지 않고 프로젝트밖새항목을 생성하는 계획으로 이어짐을 구분한다. 제외대상은 전체조회가 아니라 이 제목기반재사용검색이다. 개인명령실행·Whiteboard본문수정·MAILBOX추가·통신은 하지 않았다. 이해완료로 기록하지 않는다.

모기는 Area·프로젝트 소속 항목도 모두 검색해야 하지 않느냐고 현재 검색범위에 이의를 제기했다. 고정head README37·73과 reminder.test의 제목선택 조건을 대조해 이것이 문서·코드·테스트에 들어 있는 현행 규칙임을 확인했다. Things가 강제하는 제한이 아니라 자체 selector의 규칙이며, Area생략을 검색제한없음과 새생성시Area없음으로 따로 해석하는 방안을 설명한다. 기존항목을 위치에 관계없이 찾되 재사용시부모를 유지하고, 없으면Area없는새항목, 여러개면자동선택중단이라는 방향을 제안한다. 모기의 실제 기대가 드러났으나 최초요구가 정확히 그랬다고 소급하지 않고, 구현변경 확정·전체읽기이해완료로 처리하지 않는다. 이번은 정책논의이며 MAILBOX전달·제품변경·Whiteboard본문편집·메시지전송은 하지 않았다.

모기는 Area생략시전체검색 방향을 MAILBOX에 적도록 명시했다. 기존내용을 보존하고 제목기반대상선택 수정요청을 추가했다. 정확한제목·열린항목 기준의 전체Area/프로젝트검색, 한개면같은ID/부모유지, 없으면Area없는생성, 동명여러개면중단을 전달하며 명시Area검색변경으로 넓히지 않았다. 뒤의JS/Swift/readback대상검증·쓰기직전재확인과 시험/문서/임시표도 함께대조하도록 요청했다. 정본은 MAILBOX이고 원본구현·수신완료를 뜻하지 않는다. 일반전달요청이므로 Orca신호를 보내지 않았고 Whiteboard v29·제품코드·커밋/푸시는 변경하지 않았다.

모기는 현재까지의 MAILBOX를 투두냥에게 먼저 보내도록 명시했다. 현재주소와 실제Run/terminal·자기resolve를 대조한 뒤 전체본문과 정본경로를 한 번 전송했다. 14:45:29 KST `msg_6f26ad90d313` enqueue 성공이며 응답 delivered_at null, 인수·시작·완료는 미확인이다. 투두냥이 자기기록으로 옮긴뒤 MAILBOX를 비우도록 요청했고 발신자가 비우거나 재전송하지 않았다. [통신 정본](../communication/log/2026-10-14-03-pr28-reading-mailbox.md)을 따른다. Whiteboard·제품코드·커밋/푸시는 변경하지 않았다.

`msg_674b4f32c856`으로 투두냥 대표가 세 요청 인수를 회신했다. 실제 MAILBOX0바이트와 todo-ops 로컬 인수파일의 내용/조건을 확인했다. 파일은 원문그대로복사라기보다 의미를보존해줄여정리한기록이며 그구분은 통신로그에 남겼다. 투두냥은 착수·PR배치를모기결정뒤진행한다고보고했으므로 인수완료와작업시작을구분한다. [통신 정본](../communication/log/2026-10-14-03-pr28-reading-mailbox.md)을 따른다.

투두냥이 `msg_4809fc130c97`으로 모기결정이라며 전체제목검색수정·임시호출표를같은PR28브랜치에추가하고 URL update조사는별도진행한다고전했다. Codex리뷰뒤새head를알려독립재확인받겠다는변경예정보고다. 새head미수신·독립미검증이며 현재Whiteboard v29 pins/본문을유지했다. [통신 정본](../communication/log/2026-10-14-03-pr28-reading-mailbox.md)을 따른다.

모기는 readOpen의 약17초가 너무길다며 이유를 물었다. 고정head open.js·read-open.applescript·dashboard snapshot.js와 v29 실측보충을 읽었다. readOpen은 osascript를 한 번 실행하고 전체 stdout 이후 parseOpenRows하며, 스크립트는 열린항목목록을 먼저가져온뒤 각항목의 ID·project·Area·이름·4종날짜·태그를 순차조회/정리한다. Apple 공식 AppleScript Fundamentals의 앱객체참조와 값 구분을 확인해 Java메모리getter처럼 모든값이 이미복사된것이아니라는 점과 Spring에서목록뒤항목별외부조회하는형태의비유를 설명한다. 앱의개별속성조회왕복은 주요병목후보이나 실제Apple event수·단계별시간·Things내부처리비율은미측정이며 17초의확정원인으로단정하지않는다. 현재는 전체필터를목록으로받는수정이있어 이전 live whose 재조회문제를현재잔존원인이라고확정하지않는다. timeout60초는실패까지기다리는상한변경이고성능개선이아니다. 목록조회/항목속성조회/문자열정리시간을나눠측정하고공식지원범위의묶음조회·중복부모조회감소를비교하는방향을설명하되개인목록재측정·구현변경·새MAILBOX요청·메시지전송은수행하지않았다.

모기는 readOpen이 기존 장보기 유무검색인지 확인했다. 직전에대조한 snapshot.js→readOpen→read-open.applescript는현황판전체열린목록조회이고 write.js/upsertTodo→planReminder→read-reminder-target.applescript는제목/ID대상선택이라고 구분해답한다. 86개약17초보고는전자측정으로후자시간이라고확대하지않는다. 전체제목검색수정도대상선택함수경로의변경이며두조회가같은함수라는뜻은아니다. 채팅설명만하고 Whiteboard·제품·MAILBOX·통신은변경하지않았다.

모기는 readOpen을제목검색으로착각했다가현황판조회임을확인했고현황판은오래걸려도괜찮다고밝혔다. 함수설명에사용처를명시했어야한다고지적했으며86개전체로드대신10개만로드하도록다음PR에서수정하자고요청했다. 사용처·호출시점을함수근처에밝힐필요가드러난피드백으로기록한다. 현재PROMPTS의사용자사건/대상/시점명시규칙을함수사용처에도적용하고전체읽기완료로확대하지않는다. 다음PR의현황판최대10개로드와제목검색별개,선택/정렬기준미정,화면만10개표시와실제읽기범위구분을MAILBOX에추가했다. 17초긴급최적화요청이나PR28범위확대로처리하지않았고새메시지를보내지않았다. 기존읽기질문은채팅에서답한다는선호를유지해Whiteboard v29를편집하지않았고제품코드도변경하지않았다.

## 설명 피드백 — 함수가 어디에서 쓰이는지 바로 명시한다

모기는 `readOpen()`이 기존 “장보기”를 찾는 함수라고 이해한 상태에서 약 17초라는 조회 시간을 읽었다. 이후 현황판 전체 목록을 읽는 함수라는 설명을 받고 착각을 바로잡았으며, 함수 설명에 사용처를 명시했어야 한다고 지적했다. 이어 이 피드백을 세션 관찰 일지에도 분명히 남기도록 요청했다.

설명에서 빠뜨린 것은 **누가, 어떤 사용자 사건에서, 무슨 목적으로 이 함수를 호출하는지**다. 함수 이름과 내부 동작만 설명하면 서로 다른 조회를 같은 흐름으로 이해할 수 있다. 앞으로 함수가 처음 나오는 자리 가까이에 호출하는 쪽·호출 시점·목적을 함께 적고, 비슷한 조회 함수가 있으면 각각의 사용자 사건을 구분한다. 이는 현재 PROMPTS의 사용자 사건·대상·시점 명시 규칙을 실제 함수 사용처까지 연결하는 피드백이다.

이 사례에서는 다음처럼 먼저 밝혔어야 한다.

- **현황판을 열거나 “현재 상태 갱신”을 누를 때:** `collectSnapshot()` → `readOpen()` → `read-open.applescript`. 현황판에 보여줄 열린 할 일의 제목·날짜·소속·태그를 가져온다.
- **“장보기” 추가를 요청할 때:** `upsertTodo()` → `planReminder()` → `read-reminder-target.applescript`. 기존 대상의 ID를 찾아 재사용할지 새로 만들지 결정한다.

약 17초는 첫 번째 전체 조회의 보고 수치이며 두 번째 제목 검색의 측정값으로 연결하지 않는다. 모기는 사용처를 구분한 뒤 현황판에는 시간이 걸려도 괜찮다고 밝혔다. 이 반응은 해당 두 조회의 구분을 이해한 근거이며 PR 전체 읽기·이해 완료를 뜻하지 않는다. 현황판 10개 로드의 후속 구현 요청은 MAILBOX가 정본이며, 이 절은 설명에서 생긴 혼동과 보완 기준을 기록한다.

모기가새MAILBOX와함수사용처관찰피드백을투두냥에게보내도록명시했다. 현재주소·Run/terminal·자기resolve대조뒤14:58:06 KST `msg_f446df37e640`로현재MAILBOX전체와관찰항목을한번enqueue했다. 다음PR범위·10개선택기준미정·제목검색과분리·사용처명시를전달했고응답delivered_at null/인수미확인이다. [통신 정본](../communication/log/2026-10-14-04-dashboard-limit-mailbox.md)을따르며발신자가MAILBOX를비우거나앞선요청을재전송하지않았다. 제품·Whiteboard·커밋/푸시는변경하지않았다.

투두냥대표 `msg_e775cbd971c7` 회신뒤 실제MAILBOX0바이트와인수파일4절을읽어현황판10개로드·함수사용처피드백 인수를확인했다. 10개제한은PR28머지뒤다음PR에서기준을모기와정하고,사용처명시는현재PR28리뷰수정라운드임시표에반영하겠다는진행예정보고다. 인수와구현/문서반영완료를구분하며[통신 정본](../communication/log/2026-10-14-04-dashboard-limit-mailbox.md)에기록했다.

## 피드백 대상 정정 — 화이트보드냥의 다음 세션 설명 개선

모기는 `readOpen()`의 사용처를 명시하라는 피드백이 **화이트보드냥이 다음 세션부터 자신의 설명을 개선하라는 뜻**이었다고 정정했다. 화이트보드냥은 이를 투두냥의 임시 호출 표 수정 요청까지 넓혀 전달했다. 앞선 전달·인수는 실제 통신 이력으로 보존하되, 그 전달 범위를 모기의 원래 의도였다고 기록하지 않는다.

다음 세션에도 적용되도록 PROMPTS의 현재 설명 순서 2번에 함수 사용처·호출하는 쪽·시점·목적을 명시하는 규칙을 보완했다. 함수 이름과 내부 처리만 소개하지 않고, 현황판 열기/갱신 또는 할 일 추가라는 사용자 사건에 연결한다. 비슷한 조회 함수의 사용처를 각각 구분하고 설명 피드백을 다른 역할의 작업으로 자동 확대하지 않는다.

모기는 이미 전달된 사실을 받아들이는 반응을 보였으며 철회·추가 전송은 요청하지 않았다. 투두냥에게 새 메시지를 보내거나 인수 기록을 고치지 않았다. 현황판 10개 제한의 다음 PR 요청과 이번 화이트보드냥 설명 개선 피드백은 별개다. 제품 코드·Whiteboard 본문·MAILBOX·커밋/푸시는 변경하지 않았다.

## 새 head 독립 재확인 — Whiteboard v53

투두냥의5434c05갱신요청을받아별도복사본에서092dc8d→현재14파일/전체base→head45파일을읽고전체검색·소속보존·JS/Swift/readback조건을대조했다. 테스트244/skip0·docs-impact45/경고0·공백·변경AppleScript2/Swift정적검사·help출력통과다. Codex P3두건수정·Cubic기존문서수정유지·실제버튼이름을확인했다.

기존리뷰를repin해v53으로갱신했다. 전체본문/그림/검증·63소스/현재원문코드4를대조했고9렌즈/45파일/미분류0·총44컴포넌트·보충51~54보존·lease종료/working0이다. CALL TREE7frame은지원되는부모교체로새ID가배정됐고문서/그림ID는유지한다. ②전체제목검색·④기존소속기준검사·⑤readOpen현황판사용처·임시표·다음PR10개미적용을연결했다. 모기의사용처피드백이화이트보드냥의설명개선이라는정정은PROMPTS와기록에유지한다.

새head프로젝트Anytime실기기재사용은투두냥의UAT댓글보고로구분해본문에반영했다. 이전UAT1~3은092dc8d결과이며현재head실기기전체검증으로바꾸지않는다. 새trace3개는각48/22/26이벤트반환·event0위임지시확인이고모기원문으로바꾸지않았다. 자세한검증·통신은[정본](../communication/log/2026-10-14-05-pr28-head-refresh.md)을따른다. 제품변경·개인앱쓰기·공개업로드·커밋/푸시는없다.

새head독립확인완료뒤원delivery ACK/inbox0,현재주소를다시대조해15:20:14 KST `msg_257c104ee6d6` 완료답장enqueue성공·상대수신미확인이다. 고정v53과검증/보고구분·10개제한다음PR·내설명피드백정정도함께알렸다. 새작성후보충요청을반복하지않았다.

## v53 갱신 뒤 설명 — 같은 요청의 전후 비교

모기가 어떻게 바뀌었는지 물었다. 이전092dc8d와새5434c05를같은가상“장보기”/Area생략요청으로비교한다. 이전에는Area·프로젝트밖에서만찾아기존프로젝트안항목을재사용하지못하고apply시새항목을생성하는흐름이고,새코드는모든소속에서같은제목의열린후보를찾아한개면같은ID/부모유지,없으면Area없는생성,여러개면중단이다. 저장값확인도재사용이면요청의nullArea가아닌발견했던Area/project와대조한다. 명시Area검색범위유지,readOpen현황판전체조회와10개제한다음PR,임시호출표/사용처설명추가를구분해답한다. 구현변경과Whiteboard설명변경을분리하며추가수정/시험/통신은없다. 사용자의이해완료는아직확인되지않았다.

## 모기의 현재 설명 수용·직접 머지 의사

모기는 새 검색 규칙의 전후 설명 뒤 이대로 마무리해도 될 것 같다고 밝혔고 PR은 자신이 머지하겠다고 말했다. 원본 mogi-productivity를 화이트보드냥이 건드리지 않는 경계를 다시 명시했다. 현재 설명·진행 결과를 수용하고 직접 머지를 선택한 것으로 기록하며 모든 코드의 이해·실제 머지 완료·새 UAT 완료로 확대하지 않는다.

화이트보드냥은 원본 코드·문서·branch·PR·댓글·머지를 변경하지 않았다. 제품의 머지 선택과 이 기록소의 실제 세션 종료 요청을 구분해 이번에는 인계·커밋/푸시·터미널 종료·추가 통신을 수행하지 않았다. 현재 Whiteboard v53과 독립 검증 결과는 유지한다.

모기는 이어 이 기록소의 커밋·푸시를 명시적으로 요청했다. mogi-whiteboard의 설명규칙·상태·관찰·통신 기록8파일만 대상으로 삼고 로컬주소·대화원문·snapshot은Git제외를확인했다. 원본제품repo/PR/머지는대상에포함하지않으며세션종료인계요청으로확대하지않는다. 커밋·푸시성공여부는실제Git/원격결과로확인해최종응답한다.
