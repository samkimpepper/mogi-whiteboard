# 2026-10-07 — 세션 시작 자기 Run 주소 갱신 😸

모기가 `.local/agent-registry/whiteboard.json`을 매 세션 시작 때 갱신하도록 이 레포 규칙·지침 파일 수정을 요청했다. 확인 당시 파일은 10월 2일의 옛 runtime·터미널 주소였고 Run ID가 없었다.

`AGENTS.md`에 역할과 시작 읽기 순서·주소 갱신/확인 절차를 추가하고 HANDOFF·DECISIONS·communication/README.md에 연결했다. 과거 계획 문서에는 이번 후속 적용 범위와 기존 계획의 당시 상태를 구분하는 안내를 추가했다. 기존 유효한 Run 유지, 주소 확인 불가 시 기존 파일 보존, 다른 담당자의 임의 교체 금지, 명시적 역할 지정 시 `--replace` 사용을 적었다.

기존 등록 스크립트는 schemaVersion 2에 runId·consumerGeneration을 기록하고 resolve에서 실제 Run 연결을 대조하도록 확장했다. 환경 변수 ORCA_TERMINAL_HANDLE이 없으면 CLI terminal show의 caller 주소로 자기 터미널을 확인하며 작업공간·로컬 Codex 조건도 검사한다. 이 세션의 CLI 선택 환경 변수도 따른다. Run 생성·복구는 시작 안내에 명시한 조건을 확인한 에이전트가 수행하며 스크립트가 임의로 만들거나 연결을 교체하지 않는다.

모기가 현재 세션을 화이트보드냥으로 지정한 근거로 `register whiteboard --replace`를 실행해 현재 주소를 등록했다. 이어 `register whiteboard` 재실행과 `resolve whiteboard`가 성공했다. 현재 Run은 `run_1e7c2974ac9f`이며 새 Run을 생성하거나 binding을 변경하지 않았다. git check-ignore로 로컬 파일의 제외를 확인했다.

`python3 -m unittest discover -s scripts -p 'test_*.py'`의 8개 테스트가 통과했다. 정상 등록/resolve, Run 부재 시 기존 파일 보존, Run 변경·consumerGeneration 변경 거절, 다른 주소의 명시적 교체 요구, 다른 작업공간의 등록 거절, 환경 변수 없이 caller 조회, 다른 터미널 소유 Run 거절을 fixture로 확인했다. git diff --check도 통과했다. 다음 새 세션이 시작 지침을 실제 실행하는 것은 아직 관찰하지 않았다.

수정 범위는 이 기록소와 자기 로컬 주소 파일이다. 다른 역할 주소·mogi-productivity·MAILBOX·알림 훅은 변경하지 않았다. 전체 계획의 새 경로 이관·등록 잠금·담당자 교체 세대 자동 제어는 이번에 구현하지 않았다. 세션 종료 요청이 아니므로 커밋·푸시·종료 인계를 수행하지 않았다.
