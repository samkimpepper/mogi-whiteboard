# 역할 등록 실험 😸

## 세션 시작 때 자기 주소 갱신

2026-10-07 모기의 요청으로 **화이트보드냥은 매 세션 시작·resume 때** `.local/agent-registry/whiteboard.json`을 갱신한다. 시작 지침은 루트 `AGENTS.md`와 `HANDOFF.md`에 있다. 과거 주소 등록 계획의 미구현 기록보다 이 후속 규칙을 우선한다.

1. 설치된 `orca-cli` 스킬 안내로 이 세션의 CLI 실행 파일을 정한다. 아래 `orca`는 기본 설치 예시이며 환경에 맞는 동일 실행 파일을 계속 쓴다.
2. `orca terminal show --json`·`orca orchestration run-current --json`으로 **호출한 자기 터미널**과 Run을 확인하고 현재 목록에 대조한다. 환경 변수 `ORCA_TERMINAL_HANDLE`이 없으면 스크립트도 `terminal show`로 caller를 조회한다. 작업공간 이름·터미널 제목만으로 자기 주소를 추측하지 않는다.
3. 유효한 기존 Run이 연결돼 있으면 그대로 사용한다. resume 후 연결이 빠졌으면 같은 대화의 기존 Run임과 대표 연결 이전을 확인한 경우에만 `orca orchestration run-use --id <확인한-Run-ID> --from <자기-handle> --json`으로 복구한다. 새 역할 담당으로 지정됐고 자기 Run이 없으면 `orca orchestration run-create --objective '화이트보드냥 메시지 수신' --from <자기-handle> --json`으로 한 번 만든다. 결과가 불명확하면 상태부터 재조회하며 반복 생성하지 않는다. 상대 Run을 가져오지 않는다.
4. 루트에서 아래 명령으로 등록·확인한다. 파일에는 `runId`, `consumerGeneration`, 현재 runtime·handle·incarnation·작업공간·host·agent와 등록 시각이 저장된다. 스크립트는 자기 로컬 Codex 작업공간과 Run 연결을 대조하고 원자적으로 파일을 교체한다. resolve는 Run·consumerGeneration도 실제 연결과 비교한다.

```sh
python3 scripts/agent-registry.py register whiteboard
python3 scripts/agent-registry.py resolve whiteboard
```

주소 변경으로 register가 거절되면 기존 파일과 현재 Orca 정보를 확인한다. 모기가 이 세션을 담당 화이트보드냥으로 지정했거나 교체를 명시한 경우 `python3 scripts/agent-registry.py register whiteboard --replace`를 실행하고 다시 resolve한다. 다른 살아 있는 담당자와 교체 권한이 불명확하면 덮어쓰지 않는다. 오래된 파일·부재·agentWait=null만으로 기존 담당자의 종료를 단정하지 않는다.

자기 주소 확인·Run 준비가 실패하면 기존 파일을 보존하고 미갱신 이유를 알린다. Run ID를 수동으로 끼워 넣어 성공한 것처럼 기록하지 않는다. 이 절차는 에이전트가 시작 지침을 읽고 수행하는 것이며 lifecycle 훅·자동 인사·상시 polling을 설치하지 않는다. 상대 주소 파일은 읽기만 한다.

## 합의한 다음 설계 — 나머지 범위는 미구현

[세션 시작·Run 주소 등록 계획](agent-address-plan.md)에 각 레포의 자기 주소 파일, 역할별 대표 한 명, 동일 세션/다른 세션 동시 실행, 등록 잠금·교체 세대·송수신 전 확인 규칙을 정리했다. 2026-10-06 당시에는 계획 기록만 요청했다. 10월 7일 후속 요청으로 위 화이트보드냥 시작 절차·기존 주소록 Run 저장을 적용하며 나머지 계획은 미구현이다.

## Whiteboard 작성 뒤 보충 요청

2026-10-07 모기가 앞으로 매 Whiteboard 작성 완료 뒤 투두냥이에게 보충 요청 신호를 보내도록 요청했다. [DECISIONS의 해당 규칙](../DECISIONS.md#whiteboard-작성-뒤-투두냥이에게-보충-요청을-보낸다)이 정본이다. 상시 감시나 훅이 아니라 작성한 에이전트가 완료 단계에서 수행한다.

1. 독립 설명·필요한 검증·본문 재확인을 마치고 Whiteboard authoring lease를 종료한다. PR·리뷰 ID·현재 version·base/head를 확인한다.
2. MAILBOX 기존 내용을 보존하고 보충 요청을 추가한다. 구현 중 선택한 이유·빠진 문맥만 관련 설명 옆에 통합하며 기존 인용·발췌와 얇은 문서 흐름을 유지하도록 요청한다. 새 head는 먼저 알려 독립 확인을 받도록 한다.
3. 투두냥 레포 `/Users/leechaerim/orca/mogi-productivity/.local/agent-address.json`을 읽는다. 상대가 자기 주소를 제공하며 투두냥 레포에 화이트보드냥 스크립트·경로에 등록하라는 지침을 요구하지 않는다. 아래 10월 2일 공통 주소록 실험보다 이 현재 주소를 우선한다.
4. 설치된 Orca 안내에 따라 자기 Run과 상대 `run-show`·`terminal show`를 조회한다. 주소의 runtime·Run/consumerGeneration·handle/incarnation·작업공간·host·agent와 connected/writable을 현재 상태에 대조한다. 불일치하면 추측 전송이나 상대 주소/Run 연결 변경 없이 미전송 이유를 보고한다.
5. `orca orchestration send --to run:<확인한-투두냥-Run> --subject 'PR #<번호> Whiteboard 보충 요청' --body '<MAILBOX 경로·리뷰/version·pins·요청 범위>' --json`으로 한 번 보낸다. 이 명령은 기본 설치 예시이며 선택한 동일 CLI를 계속 사용한다. 메시지 ID·전송 결과를 `communication/log/`와 해당 세션 기록에 남긴다.
6. 전송 성공은 enqueue이며 읽음·작업 시작·보충 완료를 뜻하지 않는다. 침묵만으로 중복 전송하지 않는다. 회신이 들어오면 현재 본문과 version/pins·변경 내용을 확인하고 그때 보충 완료를 기록한다. 모든 작은 읽기 질문마다 다시 요청하지 않는다.

## 현재 추가 실험 — 2026-10-06

모기의 요청으로 Orca `orchestration send/check/reply`를 한 번 시험했다. 현재 화이트보드냥 Run `run_1e7c2974ac9f`, 투두냥 Run `run_928b164d57fb`를 만들고 각 현재 세션에 연결했다. 수신·답장·양쪽 ACK를 확인했으며 새 Task/Dispatch/worker나 자동 알림 훅은 만들지 않았다. 알림은 프롬프트 위치에 보이지만 본문은 발신자·메시지 ID가 있는 도구 결과로 읽힌다. [실험 근거와 한계](log/2026-10-06-01-structured-message.md).

아래는 2026-10-02 terminal 주소 등록 실험 당시 규칙이다. 세션·runtime이 달라질 수 있으므로 현재 Run/handle은 전송 전에 Orca에서 다시 확인한다. 상대 등록 파일은 대신 갱신하지 않는다. 이번 실험은 상시 통신 운영이나 자동 MAILBOX 전달의 승인이 아니다.

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
