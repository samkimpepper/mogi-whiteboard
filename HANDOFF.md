# Whiteboard 실험 인계

이 저장소는 Whiteboard를 실제 코드 이해에 써 보고, 모기에게 유효했던 표현과 부족했던 점만 기록하는 개인 실험 기록소다. 동결한 `mogi-cards`/과외냥이 하네스를 다시 만드는 프로젝트가 아니다. 반복해서 관찰되지 않은 기능, 자동화, taxonomy, dashboard 등을 먼저 만들지 않는다.

## 2026-10-01 재개 — PR #9 새 head 갱신 완료라옹 😸🐾

모기가 이전 세션의 미완료 갱신을 요청했다. 이번 세션은 danger-full-access / 승인 정책 never이며 Whiteboard MCP 읽기·쓰기가 정상 응답했다. 이전 승인 오류의 내부 원인은 확정하지 않았고 권한 설정도 변경하지 않았다.

- 기존 리뷰 ID `f0081637-7560-480a-91df-275735cde566`를 유지하며 **version 36 → 76**으로 갱신했다.
- 현재 pins: repositoryId `a7b90208-d78a-4390-ab08-d74221eb222f`, base `451ced7deb1fe0344a52b5982a6d69ebcbde5e8d`, head `4e33226029f8aa469008d31c146d235ad1e97639`. GitHub의 현재 OPEN PR head도 같은 commit이었다.
- 설치 전 Git root·main 검사, preview/apply 경계, 설치 flow·CALL TREE, Cubic P2/P3 지적·작성자 대응·독립 검증, 이동한 원문 링크를 반영했다. 기존 작성자 인용과 짧은 코드 블록을 보존하고 고양이 말투를 적용했다.
- 검증: 원문 범위 53개가 유효하며 원문 코드 발췌 5개가 정확히 일치했다. 기존 발췌는 6·7·5줄, 새 Cubic 발췌는 8·1줄이다. 변경되지 않은 원문 범위 17개는 이전 head와 내용이 같았고 작성자 인용도 보존됐다. staleSources와 미분류 lens 변경은 0이다.
- 이전 독립 실행 검증의 전체 121개 통과 로그와 동일 commit의 clean clone이 남아 있음을 확인했다. 이번 재개에서 테스트나 설치 preview를 새로 실행하지 않았으며 본문에 구분했다.
- hosted trace 조회는 `TraceStorageDeniedError: You cannot use this repository.`로 거절됐다. trace 없음으로 해석하지 않고 이전 작성자 인용의 원문을 이번에 독립 확인하지 못한 점을 본문에 남겼다. 설정 변경·우회·재업로드는 하지 않았다.
- 문서를 다시 읽고 document/lenses lease를 종료했다. `session_open`이 성공했지만 화면 제어 도구는 시간 초과되어 실제 표시 범위는 아직 독립 화면 확인 전이다.
- 읽기 완료: 모기가 Cubic 리뷰까지 모두 읽었다고 알렸다. 특히 P2에서 main checkout 요구가 설치 검사로 이어지지 않은 이유를 생각해보고, 비슷한 일이 다시 발생하면 `mogi-productivity`의 문서 라우팅·설계를 점검하자고 관찰했다. 누락 원인은 미확인이고 현재 전체 점검·문서 변경 요청은 아니다.
- 다음 행동: 모기의 다음 실제 질문·소감에 맞춰 이어간다. 문서 요구 누락이 재발하면 위 점검 조건을 참고한다. **갱신안을 다시 적용하거나 옛 version 전체를 덮어쓰지 않는다.** 원본 저장소는 변경하지 않았다.
- 앞선 기록은 `6e2542a`로 main 커밋·푸시 완료했다. 아래 이전 세션의 미커밋·미적용 상태는 당시 기록이며 위 상태가 최신이다. 이번 갱신·읽기 관찰 기록도 사용자 요청으로 후속 커밋·푸시 대상에 포함한다.

## 이전 세션 종료 기록 — 당시 미적용 상태 😸🐾

모기가 세션 종료와 인계 준비를 요청했다. 현재 작업은 **독립 검토와 갱신안 준비까지 완료, 실제 Whiteboard 적용은 미완료**다. 이번 세션에서는 추가 원인 조사나 권한 변경을 진행하지 않고 종료한다.

- 이어갈 작업: 기존 PR #9 리뷰를 head `4e33226029f8aa469008d31c146d235ad1e97639` 기준으로 갱신한다. 적용안은 `drafts/pr9-4e33226-update.md`와 JSON이다. Cubic 두 지적의 코드 반영, 전체 121개 테스트 통과, install preview 5가지 경우를 독립 확인했다.
- 차단 상태: Whiteboard MCP는 읽기부터 `MCP tool call requires approval, but approval policy is never`로 거절됐다. 최신 문서 version과 pins는 확인하지 못했다. 마지막 직접 확인은 version 32이며, 이후 코드 조각·말투 변경을 보존해야 한다.
- 진단 근거: 세션 로그에서 never는 처음부터 같았다. 10/1 08:52:16 KST에 권한 프로필 disabled→managed/:workspace 및 파일·네트워크 restricted가 적용됐고, 다음 작업의 09:41:47 KST 첫 Whiteboard 호출부터 오류가 발생했다. 원본 로그 경로·행 번호는 세션 기록의 “서브에이전트의 세션 로그 조사”에 있다.
- 아직 모르는 것: 설정 변경 주체·UI 경로·내부 승인 판정 원인. Codex, 실행 클라이언트, Whiteboard 중 어느 쪽의 결함인지 확정하지 않는다. 사용자가 최근 Codex 오류 이야기를 들었다는 것은 사용자 관찰이며, 특정 제품 버그로 검증한 사실은 아니다.
- 재개 순서: 현재 세션 권한과 정상 Whiteboard 읽기 접근을 먼저 확인한다. 접근 가능하면 현재 문서와 PR head를 다시 확인하고 갱신안을 적용한다. 계속 막히면 기존 로그 근거에서 진단을 이어가며 같은 오류만 반복 확인하지 않는다. 승인이 거절된 호출을 CLI·UI·SQL 등으로 우회하지 않는다.
- 로컬 상태: 문서 변경과 새 파일은 저장돼 있으나 이번 추가분은 커밋·푸시하지 않았다. `git status --short`로 확인한다. 임시 clone·테스트 로그는 삭제하지 않았다. 재개 시 남아 있는지 확인하고, 없으면 동일 commit의 clone을 다시 준비한다.
- 우편함: `MAILBOX.md`에는 투두냥이에게 보낸 독립 확인 결과와 적용 차단 상태가 있다. 수신 전 내용을 덮어쓰지 않는다. 다음 세션에서 현재 내용을 확인한다.

새 세션 시작 문장:

```text
HANDOFF.md부터 읽고 화이트보드냥이 역할로 이어가줘라옹. PR #9 새 head 4e33226의 독립 검토·갱신안은 준비됐지만 Whiteboard MCP 승인이 막혀 실제 적용은 미완료야. 먼저 현재 권한과 Whiteboard 읽기 접근을 확인하고, 접근되면 기존 문서의 최신 수정·인용을 보존하면서 drafts/pr9-4e33226-update.md를 적용해줘. 원인은 Codex/Whiteboard 어느 쪽인지 아직 확정하지 않았어. 원본 mogi-productivity는 변경하지 말아줘.
```

## 이전 세션의 검토·갱신안 준비 경과

2026-10-01 모기가 투두냥이의 Cubic 대응 후 새 head `4e33226029f8aa469008d31c146d235ad1e97639` 기준으로 기존 설명을 독립적으로 갱신하라고 요청했다. GitHub PR head와 로컬 commit을 확인하고, Cubic 리뷰·inline 코멘트·작성자 답변·일반 코멘트를 조회했다. `cubic-dev-ai[bot]`의 두 지적은 설치 시 Git root/main branch 확인 누락(P2), label 테스트의 정규식 해석(P3)이었다. 새 코드에서 두 수정의 반영을 독립 확인했다.

새 임시 clone `/private/tmp/mogi-productivity-pr9-4e33226-whiteboard.OFPpaH`에서 `node --test`로 121개 통과를 확인했다. 실제 임시 Git 저장소와 feature worktree에 install preview를 실행해 main 루트·feature 위치에서 명시한 main은 통과, feature worktree·main 하위 폴더·detached checkout은 거절되는 것을 확인했다. 원본 저장소나 실제 예약·외부 앱은 변경하지 않았다. 새 clone은 detached HEAD이며 최종 Git 상태는 clean이다. PR 전체 diff는 7 files, +481 / -6; 직전 head 이후는 4 files, +68 / -4다.

이번에도 Whiteboard MCP의 지침·capabilities·본문 읽기는 모두 `MCP tool call requires approval, but approval policy is never`로 거절됐다. 실제 repin과 본문 갱신은 하지 않았으며 최신 version과 pins는 미확인이다. CLI·UI·SQL로 우회하지 않았다. 독립적으로 준비한 `drafts/pr9-4e33226-update.md`와 JSON에 적용 순서·Cubic 설명·직접 검증 결과·이동한 코드 조각을 넣었다. 접근 가능한 독립 세션은 현재 문서를 다시 읽고 새 clone을 등록해 기존 리뷰를 repin한 뒤 적용한다. 작성자에게 설명 작성을 대신 요청하지 않는다.

모기의 명시적 요청으로 서브에이전트가 부모 세션 JSONL을 조사했다. never는 최초부터 같았지만 10/1 08:52:16 KST thread_settings_applied에서 권한 프로필이 disabled에서 managed/:workspace로 바뀌고 파일·네트워크 제한이 적용됐다. 다음 작업의 09:41:47 KST 첫 Whiteboard 호출부터 승인 오류가 발생했다. 변경 주체·UI 출처·내부 MCP 승인 판정 원인은 로그에 없었다. 다음 진단은 실행 앱이 이 스레드의 권한 프로필을 적용한 경로이며, 상세 근거는 세션 기록에 있다. 설정은 변경하지 않았다.

모기가 앞으로 Cubic의 PR 리뷰도 Whiteboard 내용에 포함해 달라고 요청했다. `PROMPTS.md`의 공통 지침에 반영했다. 작성·갱신 때 리뷰 본문·코드 줄 코멘트·일반 코멘트를 확인하고, 원문 링크와 함께 지적·작성자 대응·고정 head에서의 반영 여부·검증을 설명한다.

모기가 화이트보드냥이와 구현 에이전트 투두냥이 사이에 파일 우편함을 요청했다. 루트의 `MAILBOX.md`에 실행 폴더·dotfiles 논의의 전달사항을 작성했다. 구현은 요청하지 않았으며, 투두냥이가 수신한 뒤 파일을 비우는 방식이다.

모기가 스크래치패드의 질문 여섯 가지를 보내줬다: Node와 예약 담당의 관계, pnpm 명령과 파일 직접 실행의 관계, XML plist, 기본 preview와 `--apply`, 자식 프로세스 실행, main checkout의 의미. pinned PR #9 코드와 Node·Apple 공식 문서로 확인한 답을 현재 세션 문서에 기록했다. 설명 후 이해도 평가는 아직 없다. 이 답변 작업에서 예약·원본 저장소·Whiteboard는 변경하지 않았다.

모기는 코드 조각 수정이 다른 구현 세션에서 반영됐다고 알렸으며, Whiteboard 문서에도 고양이 말투와 고양이 이모지를 요청했다. 이 세션은 Whiteboard MCP 읽기 호출부터 승인 필요로 거절돼 변경된 version을 확인하거나 말투를 직접 수정하지 못했다. `drafts/pr9-cat-tone.md`에 적용 지침과 예시를 준비했다. 접근 가능한 세션에서 현재 리뷰를 다시 읽고 최신 코드 조각 수정을 유지하며 새 document lease로 적용해야 한다. `PROMPTS.md`에도 문서 말투 선호를 기록했다.

2026-10-01 모기는 코드 표시가 실제로는 파일 전체였다고 정정하고, 필요한 코드 조각으로 잘라달라고 요청했다. 짧은 발췌의 효용이 확인됐다고 결론 내리지 않는다. 현재 Whiteboard MCP 호출은 승인 필요로 거절되고 approval policy가 never여서 리뷰를 직접 수정하지 못했다. pinned head에서 확인한 원문 6·7·5줄로 세 code_peek을 고정 Markdown 코드 블록으로 교체하는 수정안을 `drafts/pr9-code-fragments.md`와 JSON에 준비했다. 접근 가능한 세션은 현재 리뷰와 ID를 재확인하고 새 document lease로 적용한 뒤 실제 표시 범위를 확인해야 한다. 마지막 확인한 version은 여전히 32이며, 이번에는 Whiteboard를 변경하지 않았다.

현재 실험은 `mogi-productivity` PR #9 `Run holiday routine with launchd instead of Codex`다. 아래는 마지막으로 직접 읽었던 Whiteboard의 기준이며, 새 head 갱신 완료 상태가 아니다.

- PR: https://github.com/samkimpepper/mogi-productivity/pull/9
- 확인 시 상태: OPEN
- Whiteboard stable 앱: `0.1.5`
- 제목: `PR #9 — Run holiday routine with launchd instead of Codex`
- 리뷰 ID: `f0081637-7560-480a-91df-275735cde566`
- 마지막 직접 확인한 version: `32` (독립 작성 완료는 28, 작성자 판단 근거 추가 후 32; 이후 version 미확인)
- 비교 기준: GitHub PR의 고정된 base/head, 7 files, +417 / -6
- base: `451ced7deb1fe0344a52b5982a6d69ebcbde5e8d`
- head: `e4611acf3e89aeddabb1b330d3aa0ad1336e325a`
- 임시 clone: `/private/tmp/mogi-productivity-pr9-whiteboard.YFKm7B`, detached HEAD
- 상세 기록: `sessions/2026-09-30-mogi-productivity-pr9.md`

PR #7의 선호에 따라 쉬운 설명에 명령어·함수명을 붙이고, 세 code_peek에 5~7줄의 원문 범위를 지정해 설명을 달았다. flow diagram과 전후 CALL TREE도 작성했다. 지정한 원문 범위와 본문 텍스트를 확인했고, 7개 파일을 5개 lens로 모두 분류했다. authoring lease는 종료했다. 처음에는 모기가 설명을 긍정적으로 평가했지만 다음날 파일 전체가 표시된다고 정정했다. 실제 화면에서 발췌 표시를 확인하지 못했으며, 그림과 작성자 판단 근거의 효과도 별도로 확인되지 않았다.

새 설정 테스트 4개와 기존 루틴 테스트 4개를 임시 clone에서 직접 실행해 8개 통과를 확인했다. 실제 예약 설치나 외부 앱 변경은 하지 않았다. PR 본문이 보고한 전체 테스트·설치·평일 실행 결과와 이번 직접 검증을 구분했다.

모기가 trace 제공 저장소 설정을 직접 완료했다. 현재 capture는 enabled이고, `https://app.dev.fast`의 hosted 저장소에 `samkimpepper/mogi-productivity`만 업로드 허용돼 있다. PR #9의 이전 구현 세션 업로드는 provenance 불일치로 거절됐고 저장량은 여전히 0이다. 실패 안내는 저장소 업로드 허용 후 해당 저장소에서 새 에이전트 세션을 시작하라는 것이다. 우회 업로드는 하지 않는다.

작성자는 version 32의 첫 what/why 섹션에 `구현 세션이 보탠 자율 결정`을 추가했다. 당시 로컬 기록의 위치를 표기한 내용과 현재 회고를 구분했으며, 기록에서 확인되지 않은 이유를 제거했다고 명시했다. 이 인용은 native Whiteboard trace quote가 아니고, 여기서는 로컬 원문을 독립적으로 재확인하지 않았다. 모기가 추가 내용을 읽을 수 있도록 리뷰를 다시 열었다. 작성자 설명의 효과는 아직 평가 전이다.

읽는 중 모바일에서도 볼 수 있는지 질문했다. 모바일 읽기 필요가 한 번 관찰됐으며, 별도 뷰어나 자동화를 만들라는 요청은 없다.

## 완료한 첫 읽기 — PR #7

첫 실험 대상은 비공개 저장소 `mogi-productivity`의 PR #7 `Warn when implementation docs need review`다. `PROMPTS.md`의 v1을 실제로 실행했고, 읽는 도중 질문에 답하고 요청받은 문구를 수정했다. 2026-09-30 모기가 version 26을 끝까지 읽었고 첫 사용 소감을 기록했다. 코드 검토가 충분했는지는 확신하지 못했으며, 현재 추가 리뷰 수정 요청은 없다.

- Whiteboard 앱/CLI: stable `0.1.5`
- 리뷰 제목: `PR #7 — Warn when implementation docs need review`
- 리뷰 ID: `4da534f6-4888-4d97-a573-dd5d4782e1a1`
- 현재 리뷰 version: `26`
- 대상 diff: 6 files, +580 / -1
- base: `cb002412450cedf800af72f561ef1c98554a5941`
- head: `4d6fb425915e369c2741fd3f93c774e1ec178844`

리뷰는 최신 `main` 대 현재 branch 비교가 아니다. PR #7이 이미 병합되어 그 비교로는 diff가 비었기 때문에, GitHub PR의 실제 diff base와 head를 고정한 commits target으로 만들었다.

## 저장소와 checkout

- 실험 기록소: `/Users/leechaerim/orca/mogi-whiteboard`
- 원본 저장소: `/Users/leechaerim/orca/mogi-productivity`
- Whiteboard용 임시 clone: `/private/tmp/mogi-productivity-pr7-whiteboard.8XwR34`
  - `/tmp/mogi-productivity-pr7-whiteboard.8XwR34`와 같은 위치다.
  - detached HEAD `4d6fb42`에 있다.

`mogi-productivity` 원본은 읽기 전용 경계다. 코드, 문서, branch, PR, 댓글을 수정하지 않는다. 현재 원본 checkout은 clean이다. Whiteboard 리뷰의 코드 읽기와 링크는 임시 clone을 사용한다. 실험이 끝나기 전에는 임시 clone을 지우지 않는다.

실험 기록소의 기록은 `main` branch에서 Git으로 관리한다. 2026-09-30 모기가 전체 기록의 커밋과 푸시를 요청했다. 이후 추가 커밋·푸시는 사용자의 요청 범위에 따라 진행한다.

## 지금까지 실제로 관찰한 것

### `review_on` 설명

Whiteboard의 “validator가 frontmatter를 저장소 전체에서 찾는 것은 아니다”라는 문장은 관례를 평가한 말이 아니라 이 구현의 범위를 밝힌 말이다. 검사 대상 문서는 `REVIEW_DOCUMENTS`의 두 파일로 고정돼 있다. 다른 문서에 `review_on`만 추가해도 자동 등록되지 않는다. 왜 고정 목록 방식을 택했는지는 저장소 근거에서 알 수 없다.

모기는 에이전트가 이 점을 착각할 수 있으니 `REVIEW_DOCUMENTS` 근처에 주석이 있으면 좋겠다고 관찰했다. 아직 아이디어일 뿐이고 대상 저장소에는 반영하지 않았다.

### CALL TREE 설명

CALL TREE는 실제 실행 trace가 아니라 PR 전후 코드 경로를 설명하기 위해 작성된 `call_stack_diff`다. 오른쪽 `+N -N`은 호출 횟수가 아니라 연결된 코드 범위의 diff 증감이다.

처음의 행 설명은 `인자·출력·exit code 경계`, `refs`, `segment glob`처럼 지나치게 압축돼 있었다. Whiteboard version 25에서 각 행을 “이 단계에서 실제로 무엇을 하는가”라는 평문으로 바꿨다. 모기는 바뀐 설명에 매우 만족했다. 현재까지 확인된 가장 분명한 효용은 다이어그램 종류 자체보다 행 라벨의 언어가 이해도에 직접 영향을 줬다는 점이다.

### 테스트 설명

테스트 섹션도 `YAML scalar`, `trigger`, `merge-base`, `checkout`, `ref`, `exit 2`가 앞서서 이해하기 어려웠다. version 26에서 제목을 `테스트 — 어떤 상황을 확인했나`로 바꾸고, 각 항목을 “어떤 상황을 만들었는가 → 무엇을 확인했는가” 형식으로 다시 썼다. 코드 링크와 검증 범위는 유지했다. 모기는 쉬운 설명으로 바꾼 점을 긍정적으로 평가했지만, 삭제·이름 변경 확인에 `git diff`를 썼다는 사실도 함께 표기되길 원했다. 다음 설명부터 쉬운 말과 실제 명령어·함수명을 함께 쓴다.

### 읽기 완료와 코드 패널

모기는 version 26을 끝까지 읽었다. 단어·문장 링크로 오른쪽 패널에 원문 코드가 뜨는 방식은 좋지만, 전체 코드가 표시되면 읽지 않게 된다고 말했다. 실제로 봐야 할 부분만 발췌하고 주석처럼 설명을 붙이는 표현을 원했고, 코드끼리 관계를 그림으로 보여주는 것도 제안했다. 원하는 표현의 효과나 Whiteboard에서 구현 가능한 범위는 아직 확인하지 않았다.

### 한글 글꼴

리뷰 본문은 `Newsreader`, `Georgia`, `serif`를 사용하고 Newsreader에 한글 글리프가 없어 한글이 macOS의 serif 대체 글꼴로 보인다. 현재 설정 화면에는 리뷰 본문 글꼴 옵션이 없다. 시스템 sans-serif로 바꾸는 방향은 확인했지만 모기가 그냥 감수하기로 했으므로 앱이나 설치 파일을 수정하지 않는다.

## 다음 세션에서 바로 할 일

1. 이 파일과 현재 실험 기록 `sessions/2026-09-30-mogi-productivity-pr9.md`를 읽는다. PR #7의 과거 관찰이 필요할 때만 이전 세션 문서를 읽는다.
2. PR #9 새 head 갱신은 version 76으로 완료됐다. 현재 문서·pins를 확인한 뒤 모기 질문이나 읽기 소감에 맞춰 이어간다. 화면 표시 확인은 아직 남아 있으며, 완료한 갱신안을 다시 적용하지 않는다. PR #7 읽기는 완료됐다.
3. 다음 설명부터 쉬운 말과 실제 명령어·함수명을 함께 표기한다.
4. 질문이 나오면 대상 코드의 실제 근거로 답하고, 저장소·PR·질문·확인한 답을 세션 문서에 즉시 기록한다.
5. 설명을 고쳐 달라는 요청이 있을 때만 Whiteboard 리뷰를 한 군데씩 수정하고 새 version을 기록한다. 필요할 때 stable 인스턴스와 앱에서 PR #9 리뷰 ID를 연다.
6. Whiteboard 작성·갱신 시 `PROMPTS.md`의 Cubic 공통 지침도 적용한다. 원문 리뷰 링크와 확인 시점·대상 head를 남기고, 지적과 수정·검증 상태를 구분한다. 조회 실패를 리뷰 없음으로 처리하지 않는다.
7. 이번 본문 코드 발췌와 설명을 실제로 읽게 되는지 관찰한다. 작성했다는 사실만으로 효과를 결론 내리지 않는다.

Whiteboard 접근이 정상적으로 허용된 상태에서 MCP로 현재 리뷰를 읽는다. 문서를 다시 수정할 때는 먼저 Whiteboard authoring instructions를 읽고 document lease를 새로 얻는다. 지난 lease는 만료됐다고 가정한다. MCP 승인이 거절된 상태를 CLI API 호출이나 UI 조작으로 우회하지 않는다.

## 기록 파일 역할

- `MAILBOX.md`: 화이트보드냥이가 투두냥이에게 전달할 대기 중인 내용. 아래 수신 규칙을 따른다.
- `drafts/pr9-4e33226-update.md`와 JSON: 새 head의 독립 확인 결과와 적용 완료한 Whiteboard 갱신안
- `STATE.md`: 현재 실험, 현재 결론, 모르는 것, 다음 행동
- `DECISIONS.md`: 과외냥이 동결과 Whiteboard 우선 실험의 경계
- `PROMPTS.md`: 실제 사용한 프롬프트·작성 지침과 다음에 바꿀 문장 최대 1개
- `sessions/2026-09-29-mogi-productivity-pr7.md`: 읽는 도중 나온 질문, 관찰, 수정 결과
- `sessions/2026-09-30-mogi-productivity-pr9.md`: 현재 리뷰의 비교 기준, 적용한 표현, 검증 범위, 읽기 관찰

`STATE.md`는 PR #9 version 76 갱신 완료와 남은 화면 확인·읽기 평가를 기록하며, PR #7의 읽기 완료와 실제 사용 소감은 보존했다.

## 투두냥이 우편함 규칙 😸📬

모기가 요청한 초기 방식이다. 화이트보드냥이는 `MAILBOX.md`에 전달사항을 쓴다. 기존 내용이 있으면 읽고 뒤에 추가하며, 아직 수신하지 않은 내용을 덮어쓰지 않는다. 투두냥이는 내용을 읽고 자신의 작업 메모나 맥락에 옮긴 뒤 파일 내용을 전부 비운다. 파일 자체는 삭제하지 않고 0바이트로 남긴다. 빈 파일은 대기 중인 전달사항이 없다는 뜻이며, 수신한 작업의 구현 완료를 뜻하지 않는다. 이 규칙은 파일을 비워도 남도록 HANDOFF에서 관리한다. 자동 알림이나 동기화는 없다.

## 지켜야 할 경계

- `mogi-productivity`에는 어떤 변경도 만들지 않는다.
- 개인 정보, 대화 원문, 불필요한 코드 전문을 실험 기록소로 복사하지 않는다.
- 관찰되지 않은 효용이나 문제를 추측해 적지 않는다.
- 한 번에 하나의 실제 필요만 다룬다.
- Whiteboard 문구를 고쳤다는 사실과 그 결과를 구분한다. 고쳤다고 해서 좋아졌다고 자동 결론 내리지 않는다.
- 폰트 패치, 범용 하네스, 자동화는 현재 할 일이 아니다.

## 현재 열려 있는 질문

- 구현·테스트·운영 규칙의 층 구분이 읽는 동안 유지되는가?
- 구현 변경에서 문서 warning/failure까지의 전체 흐름이 충분히 설명되는가?
- 특정 구현 내용 중 여전히 이해되지 않은 부분은 무엇인가?
- 필요한 코드 발췌와 설명이 실제로 코드 읽기를 돕는가?
- 코드 관계 그림이 추가로 도움이 되는가?

이 질문들은 아직 답을 채우지 않는다. PR #7에서 고른 문장은 `PROMPTS.md`의 v2에 반영했다. PR #9의 다음 변경 문장은 관찰 전이므로 비워뒀다. 앞으로도 실제로 말한 것과 시도해 확인한 결과만 기록한다.
