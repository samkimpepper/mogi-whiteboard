# 2026-10-02 — 두 냥이의 현재 주소 등록 실험 😸

모기는 통신 실험을 시작하되 먼저 terminal ID 등록이 필요하다고 요청했다. 현재 두 역할의 등록과 한 번의 등록 확인 요청을 범위로 잡았다. 앞선 대기 지시는 이 범위에서 해제됐으며 MAILBOX 자동 알림 전체 도입으로 확대하지 않았다.

## 구현과 자기 주소 확인

`.local/agent-registry/`를 공유 주소록으로 만들고 `.gitignore`에 추가했다. `scripts/agent-registry.py`는 자기 환경 변수 ORCA_TERMINAL_HANDLE에서 주소를 받아 현재 Orca 목록에 있는 local Codex 터미널임을 확인한 뒤 자기 역할 파일을 원자적으로 저장한다. resolve는 runtime·handle·incarnation·Orca worktree·host·agent와 connected/writable을 대조한다. 단순 제목·최근 사용 순서로 수신자를 선택하지 않는다. 기존 다른 주소는 명시적 역할 교체 없이 덮어쓰지 않는다.

이 대화의 실제 handle은 환경 변수와 terminal show/read에 나타난 현재 대화가 일치했다. Orca 작업공간은 상위 `/Users/leechaerim/orca`를 가리키지만 실제 Codex cwd는 mogi-whiteboard여서 둘을 별도로 기록했다. 두 대화 terminal은 orphaned=true, agentWait=null로 표시돼도 현재 대화가 진행되거나 입력 대기하고 있었다. 이 필드만으로 종료를 판정하지 않았다. 투두냥 후보는 레포 경로·Codex identity·기존 역할 작업 내용과 입력 대기를 확인했고 별도 현황판 서버 터미널과 구분했다.

화이트보드 자기 등록·resolve 성공, Git ignore 적용과 diff check를 확인했다. 실제 목록을 사용해 등록 사본의 runtime·handle·incarnation을 각각 잘못된 값으로 바꾸는 검사에서 모두 거절됐다. 실제 등록 파일은 이 검사로 바꾸지 않았다. 종료·재시작 후 재등록, 동시 역할 교체, 원격 호스트는 이번 실행에서 확인하지 않았다.

## 등록 확인 요청

투두냥에게 REG-20261002-01 요청을 한 번 보냈다. 공유 안내·스크립트를 먼저 읽고 자기 checkout에서 register todo, 이어 resolve whiteboard를 수행한 뒤 결과를 보고하도록 요청했다. 다른 주소가 기존 등록돼 있거나 자기 identity가 확인되지 않으면 임의 교체하지 말도록 했다. 원본 레포 코드·문서·branch·BACKLOG·MAILBOX 변경, 커밋·푸시·새 agent 생성은 요청 범위에서 제외했다. 화이트보드냥은 todo.json을 대신 작성하지 않았다.

`orca terminal send`의 request ID `18a33e6f-58f4-4560-b369-457476f78c14`에 input_accepted·turn_started가 반환됐다. 입력 수락과 실제 턴 시작의 근거이며 역할 등록 완료와 별개다. 재전송은 하지 않았다. 첫 resolve todo에서는 파일이 아직 없었다.

공통 경로 안내는 communication/README.md에, 이 실험을 이어갈 때 읽는 경로는 HANDOFF에 연결했다. 현재 파일에는 실험 근거를 기록하며 전달할 업무 대기 목록을 만들지 않는다. 원본 mogi-productivity는 화이트보드냥이 수정하지 않았다.

## 결과

투두냥이 안내·스크립트를 읽고 자기 환경 변수 주소로 register todo를 실행했다. 2026-10-02T04:30:45Z에 생성한 todo.json의 내용과 자기 세션 결합을 확인하고 resolve whiteboard도 성공했다고 REG-20261002-01 완료를 보고했다. 화이트보드냥은 실제 파일과 resolve todo를 별도로 확인해 현재 Orca 목록의 동일 runtime·handle·incarnation·worktree·host·agent와 connected/writable 상태가 일치함을 확인했다. 작성자 요약만으로 등록 성공을 판단하지 않았다.

현재 두 역할의 자기 등록과 상대 주소 조회는 성공했고, 화이트보드냥 → 투두냥의 한 번의 직접 요청은 입력 수락·턴 시작·요청된 등록 실행까지 확인됐다. 투두냥 → 화이트보드냥의 직접 알림 전송, 새 세션·Orca 재시작 후 재등록, MAILBOX 작성 후 알림 트리거는 이번 실험에 포함하지 않았다. 현재 두 JSON은 Git에서 제외되고 스크립트·안내·관찰 기록은 아직 커밋·푸시하지 않았다.

이후 모기가 앞으로 통신 이력을 communication의 log 디렉토리에 자유양식으로 남기도록 요청했다. `communication/log/`를 만들고 [첫 등록 통신](../communication/log/2026-10-02-01-whiteboard-registration.md)을 소급 기록했다. 통신 기록의 정본 안내는 communication/README.md에 두고, 이 세션 일지는 구현·관찰 근거로 연결한다. 로그를 새 할 일 목록으로 사용하지 않는다.
