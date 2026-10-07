# 2026-10-07 — 투두냥 알림 수신 테스트 😸

모기가 투두냥의 Orca 알림 미수신 조사 중 테스트 신호를 한 번 보내도록 명시적으로 요청했다. orca-cli·orchestration 스킬과 설치 CLI의 messaging-and-gates 안내를 읽고 기존 Run에 status 메시지 한 건을 보냈다.

전송 전 Orca 1.4.221 runtime `014d32e0-7cea-4939-8d6b-071da50585a6`에서 양쪽 Run과 현재 터미널 목록·투두냥 terminal show·양쪽 run-current를 대조했다. 투두냥 handle·incarnation은 최신 인계와 일치하고 connected/writable이었다. 전송 직전 화면은 입력 대기였으며 agentWait=null이었다. 이 값만으로 실제 대기 감지나 원인을 단정하지 않는다.

- 발신: 화이트보드냥 `run_1e7c2974ac9f` / `term_eaaddc3b-d507-4807-ae3e-d15aa49bcdc8`
- 수신: 투두냥 `run_928b164d57fb` / `term_faf68de5-3d22-4524-a27e-0726ad83ad6f`, consumer_generation 2
- 확인 표식: `WB-PING-20261007-01`
- 메시지: `msg_c0da8beb9d28`
- 요청 ID: `104c9a1a-9f8b-43e3-a869-535c09945928`
- 등록: 2026-10-07 00:43:34 UTC / 09:43:34 KST

본문은 단일 테스트임을 밝히고 자동 알림으로 턴이 시작됐는지 수동 지시/check로 읽었는지 구분해 회신하도록 요청했다. 기존 MAILBOX 작업 재수행 요청으로 확대하지 않았다.

send 응답은 등록 성공·delivered_at=null이었다. 이어 읽기 전용 inbox 조회에서 delivered_at=`2026-10-07T00:43:35Z`, read=0을 확인했다. terminal show에는 `Run ` 뒤에 자기 Run을 check하라는 영어 알림과 `Working (2s)`가 나타났다. 이번 한 번은 알림 화면 표시·턴 시작까지 관찰됐으며 본문 수신·회신·ACK는 이 시점에 미확인이다. 과거 실패 원인이 해결됐거나 특정 가설이 입증됐다고 결론 내리지 않는다.

재전송·terminal send·Run 재연결·신규 Run/Task/Dispatch·상대 우편함 소비/ACK는 하지 않았다. MAILBOX·원본 저장소도 변경하지 않았다.

## 회신 수신

09:43:47 KST 투두냥 회신 `msg_29dd7097c0f2`가 왔다. 화이트보드냥 자신의 check로 delivery `delivery_18f1b937e039`를 받아 본문을 읽었다. 투두냥은 이번 턴이 영어 자동 알림으로 시작됐고 모기의 별도 수동 지시 없이 check를 실행해 표식의 메시지를 읽었다고 확인했다. 직접 관찰한 화면·delivered_at과 일치한다. 따라서 이번 테스트의 자동 알림·턴 시작·본문 수신·회신은 확인됐으며 이전 두 건의 누락 원인은 여전히 미확정이다. 투두냥은 자기 delivery를 ACK하겠다고 보고했으며 이 말만으로 상대 ACK 완료를 확정하지 않는다.

회신 처리 후 화이트보드냥 자신의 delivery를 ACK했고 acknowledged 일치·남은 메시지 0개를 확인했다.
