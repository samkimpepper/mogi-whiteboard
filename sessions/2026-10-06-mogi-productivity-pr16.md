# 2026-10-06 — PR #16 Mac Things Cloud 동기화 요청 😸

모기가 현재 열린 PR의 Whiteboard 작성을 요청했다. 열린 PR은 [#16](https://github.com/samkimpepper/mogi-productivity/pull/16) 한 건이었다. 원본 저장소를 수정하지 않고 `/private/tmp/mogi-pr16-whiteboard.266y6A` 별도 clone을 사용했다.

- 리뷰: `d4e9420f-1246-4cc3-841e-3118e277978c`, version **21**
- repository: `cf56b2d6-22ad-4b19-b5dd-972c1c3ab40c`
- base: `d1db63b06472fc8c46b1a2f3e5479cf4d05bb62e`
- head: `91e326f2ae21c3ae7f80a6226bb320081b648bbc`

메뉴 요청 → 응답 검증 → 3초 대기 → 반환 → 호출자인 투두냥의 별도 항목 재조회 흐름으로 설명했다. 명령 내부의 동작과 운영 규칙을 구분했고 Java 어댑터·응답 DTO 비유, sequence, CLI CALL TREE, 원문 발췌 5개를 넣었다. metadata는 defaultCollapsed 확인 근거에 뒀다. 요구 하나를 대기 코드·테스트·실제 값 재조회에 연결했다.

구현 세션 `01a0fb17-126b-7c10-a418-07e0f6fc3526`의 main user events 657·698을 exact event로 직접 읽고 원격접속 부담·3초 후 재조회 요구만 인용했다. FFF 도구는 찾지 못해 설정 변경 없이 로컬 후보 검색 후 `whiteboard trace show`를 사용했다. 전체 trace나 개인 task 원문을 기록소에 복사하지 않았다.

sync 테스트 5개·전체 166개를 독립 실행해 모두 통과했다. Cubic 계정 `cubic-dev-ai[bot]`의 P2 한 건(리뷰 `5425342684`, 줄 코멘트 `4192811275`)은 현재 head에도 미수정이다. 잘못된 응답 fixture가 preview 상태를 유지해 apply의 status 검사에 먼저 걸리므로 뒤 필드 검증 회귀를 놓칠 수 있다. 메모리 모듈에서 syncCompletion·menuEnabled 타입·beforeLastUpdated 타입 guard를 제거해도 기존 세 fixture가 rejection assertion을 통과하고, status를 requested로 고치면 누락 검사를 드러냄을 fake exec/sleep으로 재현했다. 실제 Things 호출·원본 수정은 하지 않았다. 일반 PR 코멘트·작성자 답변은 조회 당시 없었다.

PR의 이전 head UAT(2.316초 최초 새 값 관측)와 현재 head UAT(함수 반환 4.162초·그 뒤 기존 도착 값 조회)를 구분했다. 실기기 UAT는 작성자 보고이며 독립 재실행하지 않았다. 대기 완료가 Cloud 완료나 폰 업로드 완료를 뜻하지 않는 점을 설명했다.

본문 전체를 다시 읽고 링크·그림·CALL TREE의 소스 범위 40개와 정확한 원문 발췌 5개를 고정 Git source에 대조했다. Diff lenses 5개, 미분류 0개. Desktop create/open과 CLI app pick은 성공했다. CUA 화면 조회는 시간 초과로 실패해 실제 화면에서 짧은 코드 표시를 독립 확인하지 못했다. 모든 lease 종료 후 workingCount 0. 최종 PR 조회도 동일 head의 OPEN이다.

모기의 읽기 완료·만족·이해는 아직 확인되지 않았고 추가 PR 읽기 완료 건수를 늘리지 않는다. 코드 한 조각 다시 보기 활동도 아직 수행하지 않았다. MAILBOX·원본 저장소·PR 댓글은 변경하지 않았다. 이번 요청은 세션 종료가 아니며 커밋·푸시하지 않았다.

이후 모기가 투두냥이에게 보낼 말을 물어 구현자 what/why 보충·Cubic P2 대응·head 변경 시 독립 설명 우선 갱신 전달문을 제안했다. 모기가 이를 MAILBOX에 쓰도록 명시적으로 요청해 빈 우편함을 확인한 뒤 기록했다. 직접 메시지나 자동 알림은 보내지 않았으며 수신·처리 완료는 아직 미확인이다.

## 새 head 독립 갱신 — version 29

이후 Orca 구조화 통신 시험을 거쳐 투두냥의 실제 head 변경 알림 `msg_74ebf2759adc`를 받았다. GitHub에서 OPEN·head `a015592817a86d95e75de77d94d8423958b608c2`를 확인했고 이전 head와의 diff는 sync.test.js 한 파일뿐이었다. 실제 새 head에서 전체 166개 테스트가 통과했다. 새 sync 테스트의 import를 메모리 모듈로 바꿔 status·syncCompletion·menuEnabled 타입·비활성 apply·beforeLastUpdated 타입·afterLastUpdated 타입 guard를 각각 하나씩 제거했을 때 6개 모두 Missing expected rejection으로 실패했다. 작성자 보고와 별개로 직접 검증했으며 실제 Things 호출은 하지 않았다.

새 document lease로 repin하고 관련 Markdown 7개를 갱신해 version 29를 만들었다. Cubic 상태를 수정 반영·수정 후 독립 검증 확인으로 바꾸고 새 fixture 발췌·이동한 테스트 링크를 반영했다. 기존 운영 코드와 설명은 유지하고 UAT는 같은 운영 코드의 이전 91e326f 보고로 명시했다. 본문 재확인·소스 범위 40개·발췌 5개 대조, staleSources 없음·미분류 0·lease 종료 workingCount 0 확인. 이전 v21 검증은 역사로 보존했다.

Orca reply `msg_45946263d098`로 version·head·검증 결과·lease 해제를 투두냥 Run에 회신했다. 수신 delivery `delivery_9e83bc8209b4` ACK를 확인했다. 회신 등록은 확인했으나 이후 구현자 보충 완료는 아직 확인하지 않았다. 원본 파일·PR 댓글은 변경하지 않았다.
## 읽기 피드백 — 구현자 설명을 문맥에 통합

2026-10-06 모기가 구현자 보충을 소제목 하나에 덩어리로 넣은 형식이 별로이며 군데군데 알맞은 자리에 배치하길 원한다고 말했다. v36을 읽고 v46에서 단축어 대안 선택은 설계, 요청·도착 구분은 반환 계약 설명, 메뉴 재확인·무재시도는 메뉴 코드, 3초 대기 결정은 sleep 코드, 측정 발언은 UAT 설명에 통합했다. 중복을 줄이고 별도 구현자 보충 섹션을 제거했다. 추가 events 663·694·701 인용은 투두냥이의 확인 보고에서 가져온 것임을 보존하고 독립 조회했다고 표현하지 않았다. 확인용 정보는 접힌 근거에 두었다. pins·lenses·그림·코드 발췌를 유지하는 편집이며 새 코드 검증·Mac UAT는 하지 않았다. 전체 본문을 다시 읽어 문맥과 사실 구분을 확인했다. 화면 시각 검증·모기의 수정 후 평가는 아직 없다. PROMPTS에 향후 작성 선호를 기록했으며 별도 메시지나 MAILBOX 전달은 하지 않았다.

## 2026-10-07 읽기 완료·질문 — v53

모기가 다 읽었다고 알렸다. 목적어 없이 ‘요청·도착’이라고 써 바로 이해하기 어려웠고 다음 줄을 읽어 이해했다고 했다. event 694·701 같은 내부 번호는 요약이나 중요 기록 표가 필요하다고 했다. sleepImpl(3000)을 명령 안에 넣은 설계는 긍정 평가했다. Shortcuts 없이 메뉴를 누르는 원리, 이름 변경 위험·이력, 일반 Error 하드코딩과 전역 처리 필요성, Cubic 보강이 필수 필드 누락 테스트인지 질문했다.

고정 a015592의 sync.js·CLI·AppleScript·테스트를 다시 읽었다. CLI 25줄에 main().catch로 출력·exitCode=1을 맡는 경계가 이미 있음을 설명하고 오류 코드/타입·공통 formatter 제안과 구분했다. Cubic 수정은 정상 apply 응답에서 한 조건씩 틀리게 만드는 fixture 수정이며 required 검사 추가나 누락 사례 추가가 아님을 설명했다. v53에 목적어·기록 안내표·UI 자동화·오류 처리·테스트 설명을 각 위치에 보충했다. 당시 인용은 보존하고 추가 trace 원문을 독립 재조회했다고 표현하지 않았다.

Apple 공식 UI scripting 문서에서 System Events와 접근성 기반 메뉴 조작을 확인했다: https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/AutomatetheUserInterface.html . 메뉴 변경 횟수·확률은 미확인이다. 작성자 Chris Dzombak의 2021-03-15 gist revision 91c205f5328b401096d345f1b97a39f526fe4c6c에서 동일 영어 메뉴명을 확인했다: https://gist.github.com/cdzombak/100b63db2f20fa275fe9f163cebb5a60/91c205f5328b401096d345f1b97a39f526fe4c6c . 공식 Mac release notes도 검색했지만 전체 개명 이력을 얻지 못했다. 과거 사례와 현재 이름 일치를 전 기간 불변으로 확대하지 않았다.

이번에는 코드 읽기·설명 편집만 했으며 테스트·Things UAT·원본 코드 변경·메시지·MAILBOX 전달은 하지 않았다. 읽기 완료는 추가 PR 두 번째이며 설명 전부 이해나 실기기 사용 확인과 다르다. 코드 한 조각 다시 보기 활동은 아직 수행하지 않았다.

후속 피드백에서 모기는 특히 대화 답변 7번의 구체적인 테스트 입력 전후 비교로 완전히 이해했다고 말했다. 그전 Whiteboard 설명은 전혀 이해하지 못했고 맥락·자신의 경험으로 추측했다고 정정했다. 긍정 근거는 이번 비교 설명에 한정하며 이전 Whiteboard의 효용으로 소급하지 않는다. PROMPTS에 구체적인 입력·실패 검사·전후 결과 순서를 반영했다. 이어 모기가 MAILBOX 작성을 요청해 기존 내용을 보존하고 오류 코드·공통 처리 필요성 검토, 설명 방식 피드백, sleep 배치 긍정 평가를 추가했다. 기존 catch 존재를 명시하고 전면 리팩터링 결정으로 확대하지 않았다. 직접 Orca 메시지는 보내지 않았고 수신·처리 완료는 미확인이다.
