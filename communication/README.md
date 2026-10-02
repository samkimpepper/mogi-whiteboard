# 역할 등록 실험 😸

2026-10-02 모기가 현재 화이트보드냥·투두냥의 등록부터 통신 실험을 시작하자고 요청했다. 현재 범위는 역할 등록과 한 번의 등록 확인 요청이다. MAILBOX 작성 후 자동 알림은 아직 도입하지 않았다.

공통 등록 위치는 `/Users/leechaerim/orca/mogi-whiteboard/.local/agent-registry/`다. 각 역할은 자기 JSON만 쓰고 상대 JSON을 읽는다. 파일은 Git에서 제외한다. 등록은 인증 체계가 아니라 같은 Mac의 협력하는 두 세션을 연결하는 로컬 주소록이다.

각 역할의 실제 checkout 디렉토리에서 실행한다. 자기 주소는 `ORCA_TERMINAL_HANDLE` 환경 변수로 확인하며 수동으로 상대 주소를 대신 등록하지 않는다.

```sh
# 화이트보드냥: cwd /Users/leechaerim/orca/mogi-whiteboard
python3 /Users/leechaerim/orca/mogi-whiteboard/scripts/agent-registry.py register whiteboard

# 투두냥: cwd /Users/leechaerim/orca/mogi-productivity
python3 /Users/leechaerim/orca/mogi-whiteboard/scripts/agent-registry.py register todo

# 현재 Orca 목록과 대조해 상대 주소를 조회
python3 /Users/leechaerim/orca/mogi-whiteboard/scripts/agent-registry.py resolve todo
```

등록된 runtime·handle·process incarnation·Orca 작업공간·host·agent가 현재 목록과 일치하고 connected/writable일 때만 resolve가 성공한다. 여기서 확인하는 것은 주소와 입력 가능 상태이며 읽음·수신 인수·구현 완료가 아니다. `orphaned`나 `agentWait: null` 하나만으로 에이전트 종료를 판정하지 않는다. 실제 쉘 cwd와 Orca의 workspace 경로가 다를 수 있어 별도로 기록한다.

세션 교체로 주소가 바뀌면 새 역할 담당이 자기 파일을 재등록한다. 기존 주소가 달라졌으면 임의 덮어쓰기를 거절한다. 모기가 해당 역할을 새 세션에 맡긴 경우에만 register 명령에 `--replace`를 붙인다. 종료 시 등록 파일이 남아도 전송 전에 resolve로 확인하며, 불명확한 주소를 다른 세션으로 추측해 보내지 않는다.

이번 실험은 local Codex 터미널과 설치된 `orca` CLI만 사용한다. 원본 mogi-productivity 코드·문서·branch는 화이트보드냥이 수정하지 않는다. 신규 Run·Task·Dispatch·agent를 생성하지 않는다. 상대에게 입력을 보내기 전 terminal read로 대상을 확인하며 결과를 전달 기록과 독립 확인으로 구분한다.

## 통신 이력

2026-10-02 모기가 앞으로 통신 이력을 자유양식으로 남기도록 요청했다. 통신 기록의 위치와 작성 규칙은 이 절을 정본으로 삼는다.

`communication/log/`에 통신 건별 Markdown 파일을 남긴다. 파일명은 날짜·구분 가능한 이름을 사용하고 기존 기록을 덮어쓰지 않는다. 형식은 자유롭게 쓰되 누가 누구에게 무엇을 요청하거나 알렸는지, 모기의 승인 근거, 실제 전송 결과와 이후 확인한 결과를 이해할 수 있게 남긴다. 관련 MAILBOX·관찰 일지·Orca request ID 등이 있으면 연결한다.

전송 실패·수신 미확인도 실제 상태대로 기록한다. 입력 수락·턴 시작·내용 인수·요청 처리 완료를 구분하고, 작성자의 답변과 직접 확인한 근거를 따로 적는다. 후속 결과는 해당 기록에 덧붙이되 당시 전송 사실을 지우지 않는다. 각 냥이는 자신이 보낸 통신의 기록을 맡고 상대 기록을 임의로 고치지 않는다.

이 디렉토리는 통신 이력이며 별도의 할 일 대기 목록이 아니다. MAILBOX 전달 범위 정본을 유지한다. 로컬 주소록과 달리 로그는 저장소의 기록으로 관리한다. 불필요한 개인 대화 원문은 복사하지 않는다.
