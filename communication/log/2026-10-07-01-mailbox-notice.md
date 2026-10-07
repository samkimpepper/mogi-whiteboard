# 2026-10-07 — PR #16 읽기 피드백 MAILBOX 알림

## 종료 후 수신 확인

화이트보드냥은 두 회신을 처리한 뒤 delivery_4650e32ad4b2를 ACK했고 acknowledged 일치·남은 메시지 0개를 확인했다.

종료 인계 직후 투두냥의 회신 두 건 `msg_237a7dcd7e15`·`msg_59fa482c99aa`를 delivery `delivery_4650e32ad4b2`로 읽었다. 현재 새 handle에서 보낸 답장이며 각각 최초 MAILBOX 알림·연결 복구 알림의 thread_id에 연결돼 있다. 투두냥은 MAILBOX를 끝까지 읽고 한 번만 인수했으며 오류 처리 검토는 아직 미완료, 원문은 보존했다고 보고했다. 새 터미널·generation 2 연결도 확인했고 받은 delivery를 ACK하겠다고 했다. 상대 ACK 완료를 이 말만으로 확정하지 않는다. 실제 회신으로 수신·인수는 확인됐지만 어떤 계기로 check를 실행했는지는 알 수 없어 자동 깨우기 원인이 해결됐다고 주장하지 않는다. 아래 미수신 기록은 그 이전 관찰이다.

모기가 MAILBOX 작성 뒤 투두냥에게 신호도 보내라고 명시적으로 요청했다. orca-cli·orchestration의 설치 버전 안내와 messaging-and-gates를 읽고 `orca`로 구조화 status 메시지 한 번을 보냈다.

전송 전 Orca 1.4.221 runtime `014d32e0-7cea-4939-8d6b-071da50585a6`에서 투두냥 terminal show를 조회했다. 기존 handle `term_49111819-b7e0-4868-a804-3f013a554c46`·incarnation `6ff5296c-828c-4e99-84fb-b46c1d8d6b24`가 같고 local Codex, mogi-productivity main workspace, connected/writable였다. preview에도 PR #16 보충·Cubic 처리 맥락이 있었다. 양쪽 run-current로 현재 binding을 확인했다. 주소 자동 등록 계획은 아직 구현하지 않았다.

- 발신: 화이트보드냥 `run_1e7c2974ac9f` / `term_eaaddc3b-d507-4807-ae3e-d15aa49bcdc8`
- 수신: 투두냥 `run_928b164d57fb`
- 메시지: `msg_2ead5bbcc8c7`
- 요청 ID: `00155f9b-426d-4b7a-a80d-b79d9d5e3925`
- 등록 시각: 2026-10-07 00:27:51 UTC

본문은 MAILBOX의 ‘2026-10-07 — PR #16 읽기 피드백·오류 처리 검토’ 항목을 읽고 인수하도록 알렸다. 기존 CLI catch 존재, 오류 코드·타입·공통 출력 필요성 검토, 전면 리팩터링 미합의, 설명 피드백·sleep 긍정 평가, Whiteboard v53/head a015592와 이전 Cubic 처리 완료를 짧게 안내했다. MAILBOX를 정본으로 명시했다.

send 성공으로 메시지 등록을 확인했다. receipt의 delivered_at은 null이므로 읽음·인수·처리 완료는 아직 확인하지 않았다. 새 Run/Task/Dispatch/worker, terminal send, 자동 알림·polling은 추가하지 않았다.

## resume 터미널 연결 복구

이후 모기가 멈춘 기존 터미널을 닫고 새 터미널에서 resume했다고 확인했다. 현재 productivity 터미널 목록에서 이전 handle은 없어지고 동일 workspace의 Codex `term_faf68de5-3d22-4524-a27e-0726ad83ad6f`가 있었다. 새 터미널 run-current는 null, 기존 Run은 옛 handle을 계속 가리켰다. 모기의 resume 확인을 근거로 기존 Run을 `run-use --id run_928b164d57fb --from term_faf68de5-3d22-4524-a27e-0726ad83ad6f`로 다시 연결했다. consumer_generation 2와 새 handle을 반환했고 재조회에서도 binding을 확인했다. 새 Run은 만들지 않았다.

2026-10-07 00:30:41 UTC, 연결 복구 알림 `msg_0e3411cd6c4b`를 같은 Run에 보냈다(requestId `068808b6-66bd-4370-8921-3684609d2087`). 기존 메시지 msg_2ead5bbcc8c7을 확인하도록 안내하며 새 작업 요청이 아니고 중복 처리하지 말라고 명시했다. 등록 성공이며 수신·ACK·인수 완료는 아직 미확인이다. 상대 우편함을 대신 소비하거나 ACK하지 않았다. 이는 이번 명시적 복구이며 부팅 자동 등록 계획의 구현은 아니다.

## 신호 미수신 조사

모기가 신호를 받지 못한다고 알려 run-show·terminal show/read·inbox를 읽기 전용으로 확인했다. Run binding은 새 handle·generation 2로 유지됐지만 두 알림 모두 read=0, delivered_at=null이었다. 새 터미널 화면은 이전 대화의 마지막 답변과 빈 입력 대기 상태이며 새 orchestration 알림·check 실행은 보이지 않았다. agentWait=null은 관찰됐지만 이것만으로 에이전트 종료나 알림 실패 원인을 단정하지 않았다. daemon.log에서 해당 메시지·Run·handle 또는 nudge/pointer 검색 결과는 없었다.

확인된 범위는 메시지 저장·주소 연결은 성공했으나 자동 깨우기/수신 처리는 관찰되지 않는다는 점이다. resume·Orca 업데이트·idle 감지 중 무엇이 원인인지는 미확정이다. 메시지를 더 보내거나 상대 우편함을 대신 ACK하지 않았다. 모기가 선호하지 않은 terminal send로 우회하지 않고, 새 투두냥 대화에서 직접 기존 Run check를 요청하면 대기 메시지를 읽을 수 있다는 수동 복구 방법을 안내했다.
