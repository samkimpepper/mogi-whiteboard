# 화이트보드냥 resume 뒤 기존 Run 재연결 😸

모기가 터미널 화면 문제로 새 터미널에서 같은 대화를 resume했다고 알리고 Run 재등록이 필요한지 물었다. 시작 규칙을 다시 읽고 자기 주소만 복구했다. 세션 종료·새 Run 생성·상대 주소 변경 요청으로 해석하지 않았다.

`ORCA_TERMINAL_HANDLE`은 `term_d3a7736b-b5e1-4501-a29b-849d624ef508`이었다. 명시적 terminal show와 현재 workspace 목록에서 local Codex·incarnation `d8fd7df4-9642-4a09-8ec5-e7a3e94912b5`·connected/writable을 대조했다. 옵션 없는 terminal show/run-current는 같은 workspace의 별도 shell을 보여줬으므로 그 shell에 Run을 연결하지 않았다. 등록 스크립트는 환경변수의 실제 Codex handle을 사용했다.

기존 주소록의 Run `run_933f72393160`은 예전handle `term_4c19a1b3-9da2-4f37-9429-6c70623fd532`/generation1에 연결돼 있었다. 예전 터미널은 operator_close·connected/writable false, 새 자기터미널의 명시적 run-current는 null이었다. 같은 대화를 resume한 모기의 보고·기존 연결·현재 주소를 확인하고 기존 Run을 재사용했다.

13:18:51 KST `orca orchestration run-use --id run_933f72393160 --from <확인한-새-자기-handle> --json`이 성공했다. request `a8c0634b-945a-4694-8722-96bb88c0756b`, coordinator가 새handle로 바뀌고 consumer_generation2가 됐다. 재조회로 같은 값을 확인했다. 최초 register는 Run 부재, 재연결 뒤 일반 register는 옛 주소와 다름으로 각각 안전하게 거절했다. 모기의 같은 화이트보드냥 resume 지시에 따라 `register whiteboard --replace`로 자기 로컬주소를 갱신하고 resolve로 runtime/Run/terminal/incarnation/generation 일치를 다시 확인했다. 등록시각은13:18:58 KST다.

같은 Run을 명시적 자기terminal로 peek한 결과 미수신0건이었다. 새 Run/Task/worker·메시지 전송·상시polling·자동등록훅·상대주소 변경은 없다. `.local/agent-registry/whiteboard.json`은 Git 제외이며 주소를 다음resume에 고정값으로 복사하지 않는다. PR28 v29 설명/읽기 맥락은 유지하고 원본 제품repo/개인앱을 변경하지 않았다. 터미널 화면문제의 원인·trace 인증 상태는 이번에 조사하지 않았다.
