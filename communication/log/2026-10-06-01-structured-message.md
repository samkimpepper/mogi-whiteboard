# 2026-10-06 — 구조화 메시지 1회 실험

모기가 terminal send는 자기 프롬프트와 구분되지 않아 Orca 방식으로 바꾸려다 보류했던 일을 떠올리며 지금 시험하자고 요청했다. 실험 ID는 `ORCA-MSG-20261006-01`이다. orca-cli·orchestration 스킬과 현재 CLI의 messaging-and-gates 참고문서를 읽었다.

## 대상과 설정

Orca 1.4.220, runtime `c8f4bf81-ed14-40a5-8008-79f979cbddde`. 현재 목록과 투두냥 terminal read에서 PR #16 작업 세션임을 대조했다. 예전 로컬 주소록의 runtime은 오래됐으므로 그 파일을 그대로 유효하다고 보지 않았고 상대 등록 파일을 수정하지 않았다.

- 화이트보드냥: `term_eaaddc3b-d507-4807-ae3e-d15aa49bcdc8`
- 투두냥: `term_49111819-b7e0-4868-a804-3f013a554c46`

두 세션 모두 run-current가 null이었다. 시험에 필요한 우편함으로 화이트보드냥 `run_1e7c2974ac9f`, 투두냥 `run_928b164d57fb`를 run-create로 각각 연결했다. 투두냥의 연결은 현재 확인한 handle을 --from으로 지정해 수행했다. 신규 에이전트·Task·Dispatch·worktree는 만들지 않았다.

## 전송

화이트보드냥에서 `run:run_928b164d57fb`로 status 메시지 `msg_eab38dcd1490`을 한 번 보냈다. mutation request는 `726e8748-7587-4431-90ed-fb8e0959cae5`다. 수신 확인과 발신자 구분 여부를 reply로 답하고 실제 읽은 뒤 delivery를 ACK하도록 요청했다. MAILBOX의 PR #16 제목을 확인 대상으로 삼았지만, 이번 시험 때문에 PR 작업·Whiteboard 보충·우편함 비우기를 시작하지 않도록 명시했다.

send 응답에서 from_handle·to_handle·subject·body·message ID가 별도 필드인 durable enqueue를 확인했다. 이후 terminal read에서 `You have 1 orchestration message. Run ...` 알림과 투두냥의 우편함 확인 턴 시작을 관찰했다. 이 알림 자체는 여전히 사용자 입력과 같은 `›` 위치에 표시됐다. 구조화 본문과 발신 정보는 check로 가져오므로 알림 표시와 실제 메시지 provenance를 구분해야 한다.

직접 terminal send는 사용하지 않았다. 답장·ACK 결과는 아래에 이어 기록한다. 자동 통신 구현·상시 polling은 추가하지 않았다.

## 결과

투두냥은 `msg_19028c467773`로 회신했다. thread_id는 최초 메시지 `msg_eab38dcd1490`, 발신 handle은 확인한 투두냥 handle, 수신 주소는 화이트보드냥 Run이다. 사용자 직접 프롬프트와 화이트보드냥 발신을 구분했다고 명시하고 실제 MAILBOX의 PR #16 제목을 일치하게 반환했다. PR 작업·본문 보충·우편함 비우기를 하지 않았다고 보고했다.

화이트보드냥은 `check --wait --timeout-ms 30000`에서 답장을 받아 읽고 delivery `delivery_2a14b3620b9f`를 ACK했다. 응답의 acknowledged 일치·남은 messages 0을 확인했다. 투두냥 terminal read에서는 원문 check → MAILBOX 제목 검색 → reply → `delivery_224bcfc96302` ACK 명령과 완료 보고를 관찰했다. 상대 inbox를 `--peek`로 읽었을 때 미수신 메시지 0개였고 상대를 대신해 consuming check나 ACK하지 않았다.

이번 한 번은 enqueue·수신 턴 시작·발신자 구분·답장·양쪽 ACK까지 확인했다. 전용 에이전트 말풍선 UI는 아니며, 알림은 사용자 프롬프트 위치에 나타나고 실제 메시지 정보는 도구 결과에서 구분된다. 반복 전달·앱 재시작·세션 교체 후 binding은 아직 검증하지 않았다. 두 Run과 binding은 시험 이력 및 회신 주소로 남겼고 기존 세션을 종료하거나 reset하지 않았다. 이 결과만으로 자동 MAILBOX 알림이나 상시 통신 운영을 도입하지 않는다.
