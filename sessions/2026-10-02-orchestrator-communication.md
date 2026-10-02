# 2026-10-02 — mogui-ADE-orchestrator 통신 경로 조사 😸

모기가 로컬의 스승님 마스터·워커 하네스에서 terminal send인지 다른 통신 방법인지 찾아 달라고 요청했다. `/Users/leechaerim/orca/mogui-ADE-orchestrator`의 현재 checkout `962e7c1227d58ae5f22ccdba0e26bb41880ed476`을 읽기 전용으로 조사했다. AGENTS의 명시적 작업 우선 규칙에 따라 onboarding은 시작하지 않았다. 그 레포는 main이 origin보다 1 commit 앞서 있고 .agents/·.codex/가 기존 미추적 상태였으며 조사 후에도 같았다. 프로그램·hook·통신 명령을 실행하거나 해당 레포를 수정하지 않았다.

## 확인한 실제 경로

- `master-ops/scripts/dispatch:523`에서 Orca Task를 만든다. 필요하면 별도 worktree의 terminal을 생성하고, `:541`에서 `orca orchestration dispatch --task … --to … --inject`로 작업과 worker preamble을 전달한다. `:588` 이후에는 등록과 실제 전달을 구분해 터미널 상태 전이를 확인한다. 이 레포에 있는 직접 작업 배정 코드는 terminal send 한 줄이 아니라 감독되는 Task/Dispatch 경로다.
- `master-ops/scripts/spawn-test:454`는 worker가 실행할 `orca orchestration send --from … --run … --type status --subject … --body …` 명령을 만든다. `:461`에서는 그 명령을 실행하라는 첫 시험 지시를 terminal send로 넣는다. 따라서 terminal send를 전혀 안 쓰는 시스템은 아니다. 워커가 실제 메시지를 보낸 근거와 coordinator mailbox 조회를 따로 확인한다(:539 이후).
- 완료 수신은 README:73과 charter/05-dispatch-gate.md:46에서 `worker_done`과 `orchestration check --wait` 경로로 설명한다. 작업자의 완료 보고를 실제 수락과 구분해 README:74에서 diff·artifact·검증을 다시 확인하도록 한다.
- `master-ops/scripts/orca-wait:70`·`:96`은 `orchestration check`를 호출하는 wrapper다. 코드의 출력 형식에 type·id·from·subject를 명시한다(:110 이후). 메시지가 별도 queue의 구조화된 데이터로 다뤄진다는 근거다. 이 wrapper 자체를 실행하거나 현재 CLI와 완전 호환 검증을 한 것은 아니다. 실제 적용한다면 현재 설치 CLI guide에 맞춰 처리 후 ACK 계약을 확인해야 한다.
- charter/09-incident-derived-rules.md:7은 terminal handle을 라우팅 정보, standing Run을 정체성으로 구분한다. :9는 `run-current`에서 현재 binding을 확인하고 다른 master에서 그 Run 주소로 보내는 방식과 읽기 후 ACK의 중요성을 설명한다. 세션·앱 재시작에 따라 바뀌는 handle을 cross-master 영구 주소로 사용하지 않는다.
- `master-ops/scripts/hooks/orch-inbox-warn.sh:17`은 turn 시작 hook에서 `check --peek`로 메시지 수·subject를 한 줄로 알려준다. runbook/orch-inbox-warn.md:42는 turn이 없는 완전 idle 세션에서는 이 hook이 실행되지 않으며 직접 깨우는 문제는 남는다고 명시한다. 별도 mailbox가 있다고 매번 상대 턴 시작까지 보장된다고 해석하지 않는다.

## 현재 두 냥이 실험과의 관계

현재 우리가 사용한 terminal send는 사용자가 직접 입력한 것과 같은 입력 칸에 들어간다. 조사한 하네스의 구조화된 send/check 경로는 메시지 발신자·종류·ID를 별도 데이터로 전달·조회하므로 단순 본문 prefix보다 강한 구분 근거를 준다. Java로는 콘솔 입력에 문자열을 넣는 경로와, 발신 정보가 있는 메시지를 queue에 넣고 consumer가 읽는 경로의 차이에 가깝다.

우리에게 검토할 후보는 역할의 지속적인 주소를 현재 terminal handle만이 아니라 standing Run과 연결하고, 내용·답장을 구조화된 메시지로 교환하며, 수신자 attention과 실제 읽기·처리 후 ACK를 구분하는 것이다. 전체 master/worker 하네스의 도입을 자동 결론 내리지 않는다. Task/Dispatch 감독과 두 동등 역할의 메시지 교환은 범위가 다르다. 현재 두 세션에 실제 Run binding이나 별도 메시지 전달을 검증하지 않았고, 이 조사로 통신 방식을 바꾸거나 추가 메시지를 보내지 않았다. 실제 Orca 내부 transport나 사용자 UI에서 어떤 발신자 말풍선으로 표시되는지도 해당 레포의 코드만으로 확인하지 않았다.

이 파일은 요청받은 조사 결과이며 통신 이력이나 새 할 일 대기 목록은 아니다. MAILBOX 전달·원본 mogi-productivity 수정·커밋·푸시는 수행하지 않았다.

## Orca 기본 기능과 하네스의 구분

모기는 orchestration send가 Orca 기본 기능인지 mogui-ADE-orchestrator를 가져와야 쓸 수 있는지 물었다. 현재 설치된 `orca --help`, `orca orchestration send --help` 및 version-matched orchestration guide에서 직접 제공되는 명령임을 확인한 근거로 Orca 기본 기능이라고 답했다. 해당 하네스를 복사하거나 설치해야 사용할 수 있는 기능은 아니다.

Orca는 Run·메시지·Task/Dispatch·send/check/reply 같은 실행·통신 기능을 제공한다. 하네스는 그 위에 작업 계약·배정 gate·수신/ACK 절차·검증·운영 기록과 wrapper를 얹는다. 현재 두 세션에서 사용하려면 지원되는 Run 주소와 현재 세션의 binding 등 사용 조건을 확인해야 하지만 전체 하네스 도입과는 별개다. 이 질문으로 Run 생성·binding·메시지 전송을 실행하지 않았다.
