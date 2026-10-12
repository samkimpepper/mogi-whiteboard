# 인물 정보 설계 고민 MAILBOX 전달 — 2026-10-11 😸📬

모기가 ‘이제 mailbox를 투두냥이한테 전하자’고 명시적으로 요청했고 PR을 이미 머지했다고 알려왔다. 기존 MAILBOX를 읽고 보존한 채 전송 시점 상태를 덧붙인 뒤 투두냥 Run에 신호를 한 번 보냈다.

GitHub PR18은 MERGED, mergedAt `2026-10-10T07:22:31Z`(16:22:31 KST), merge commit `bd12fc2cd4824db57b882598667e7731d06329fa`, 기존 base/head로 확인했다. Whiteboard 리뷰 `ca3cf39f-2ebc-4997-9cd4-8840b427e40f`는 v42/기존 pins다. v32 구현자 보충 완료는 이전 회신/독립 확인/ACK 기록을 근거로 안내해 완료된 요청을 중복 수행하지 않도록 했다.

새 전달 핵심은 10월 10일 MAILBOX의 인물 정보 저장 범위·프롬프트/사회냥이 대화 노출·긴 기록·구조 설계의 열린 고민이다. 이번 전송이 설계 확정이나 구현/마이그레이션 착수 승인은 아님을 명시했다. 오류 로그 검토 의견·동시성 경계 수용을 새 구현 할 일로 임의 추가하지 않았다. 과거 항목은 투두냥의 기존 인수 기록과 대조하고, 자신의 맥락으로 인수한 뒤 MAILBOX를 0바이트로 비우는 절차를 따르도록 했다. 실제 사람 값/대화 원문은 메시지나 이 로그에 복제하지 않았다.

## 주소 확인

현재 runtime은 `a74112d6-9a9e-4145-a79f-3de09e637b40`이다. 자기 터미널/Run은 기존 handle/incarnation과 Run `run_1e7c2974ac9f`/generation1로 유효했다. 자기 등록의 옛 runtime을 현재 실제 주소로 replace 갱신하고 resolve했다. 상대 자기 주소 파일의 Run `run_928b164d57fb`/generation3, handle `term_725a993f-7f13-4afd-a722-f9e2b3b8bf31`, incarnation `45ffed0f-495c-4616-85c1-05b68e34e389`, 제품 workspace/local Codex/connected/writable이 실제 Orca와 일치했다. 전송 직전 양쪽 주소/runtime/Run 연결을 다시 비교했다. 상대 주소나 Run 연결은 변경하지 않았다.

## 전송 결과

2026-10-11 **08:40:06 KST** `orca orchestration send --to run:run_928b164d57fb` 1회, 메시지 `msg_617b90e9a688`, mutation request `8dbe5e30-50a5-4df4-b220-a75e5158b8d6`다. ok=true, replayed=false, exitCode0이며 durable enqueue 성공이다. 응답의 delivered_at은 null이라 수신/인수는 아직 미확인이다. 별도 Task/Dispatch/worker·상시 polling·추측 재전송은 하지 않았다.

전송 당시 MAILBOX는 15,355bytes, SHA-256 `b4f4920af6bf8bcc776e0b68a2cdbc3609dfce2a26b752c21d912de1dbffba06`였다. 화이트보드냥이 대신 비우지 않았으며 인수/논의/구현 완료는 서로 구분한다. [MAILBOX](../../MAILBOX.md)·[배경 기록](../../sessions/2026-10-08-mogi-productivity-pr18.md)을 참고한다.

## 후속 — 인수 완료 독립 확인·ACK

08:42:49 KST 작성/08:42:50 전달된 회신 `msg_e7fb61c62e9f`를 자기 Run에서 받았다. sender는 확인한 투두냥 handle이고 thread_id는 원래 요청 `msg_617b90e9a688`다. 투두냥은 저장 범위/대화 노출 설계 고민을 현재 구현·모기의 열린 질문·미채택 후보로 나누어 인수 문서와 STATE에 보존하고 main commit/push했다고 보고했다. 새 구현·마이그레이션·개인 값/Things/Runtime 변경은 착수하지 않았고 완료된 이전 보충을 재실행하지 않았다는 보고다.

화이트보드냥은 실제 `todo/handoffs/HANDOFF_2026-10-11_PERSON_CONTEXT_DESIGN.md`와 STATE 연결을 읽어 전달 범위·미결정 후보·현재 구현·인수/완료 구분 보존을 확인했다. 제품 repo HEAD와 origin의 refs/heads/main은 모두 `6606af7c184ea265f50fb6563ebe8173e39a3528`, 커밋 변경은 인수 문서와 STATE 두 파일이었다. 현재 MAILBOX 0바이트와 상대 Git 밖 보존본의 SHA-256이 전송 당시 값과 일치함도 직접 확인했다. 원본 repo의 수정은 투두냥이 수행했으며 화이트보드냥은 읽기만 했다.

검증 뒤 `delivery_f7dbdf8ea0e0`를 ACK했고 빈 우편함/acknowledged 동일 ID 응답을 확인했다. **수신·인수 완료이며 설계 해결·구현 완료는 아니다.** 추가 회신/재전송/새 할 일은 만들지 않았다. 앞의 delivered_at null/미확인은 전송 당시 상태로 보존한다.
