# PR #9 — 새 head 설명 갱신안 😸🐾

상태: **독립 코드 확인·검증 완료 / Whiteboard 미적용**

Whiteboard MCP의 지침·capabilities·현재 본문 조회가 모두 `MCP tool call requires approval, but approval policy is never`로 거절됐다. CLI·UI·SQL 등으로 우회하지 않았다. 아래는 화이트보드냥이가 독립적으로 준비한 적용안이며, 투두냥이에게 설명 작성을 대신 요청하는 안이 아니다.

## 비교 기준과 독립 확인

- 기존 리뷰: `f0081637-7560-480a-91df-275735cde566`
- PR: https://github.com/samkimpepper/mogi-productivity/pull/9 (조회 시 OPEN)
- 유지할 base: `451ced7deb1fe0344a52b5982a6d69ebcbde5e8d`
- 새 head: `4e33226029f8aa469008d31c146d235ad1e97639` (GitHub PR head와 로컬 commit을 각각 확인)
- 직전 head: `e4611acf3e89aeddabb1b330d3aa0ad1336e325a`
- PR 전체 diff: 7 files, +481 / -6
- 직전 head 이후 diff: 4 files, +68 / -4
- 새 임시 clone: `/private/tmp/mogi-productivity-pr9-4e33226-whiteboard.OFPpaH` (detached HEAD, 최종 Git 상태 clean)
- 전체 테스트 로그: `/private/tmp/mogi-whiteboard-pr9-verify.OZq3TC/tests.log`
- preview 검증 fixture: `/private/var/folders/p6/y64bglj97j33bfmv8v9d3vd80000gn/T/mogi-whiteboard-pr9-preview.dsiieh`
- 실제 Whiteboard version은 읽지 못했다. 마지막 직접 확인은 32이나 이후 사용자가 코드 조각·말투 수정이 진행됐다고 알려줬으므로 version 32 전체를 덮어쓰지 않는다.

## 접근이 가능한 독립 세션에서 적용할 순서

1. Whiteboard authoring instructions와 capabilities를 읽고 현재 문서·lenses·pins·version을 다시 확인한다. 최근 짧은 코드 블록, 고양이 말투, 작성자 판단 근거와 인용을 보존한다.
2. 위 새 임시 clone을 `session_register_repository`로 등록해 repositoryId를 얻고 base/head를 해석한다. 새 document lease를 얻은 뒤 기존 리뷰에 `session_repin`을 적용한다. 새 repositoryId, 위 base/head, 기존 PR URL을 명시한다. 문서 ID는 유지하고 이전 source pins와 내용은 history에 남긴다.
3. repin이 반환한 모든 source range·resource 경고와 현재 본문의 코드 링크·CALL TREE·설치 흐름을 확인한다. 렌즈도 별도 lease로 새 diff에 맞추고 미분류 변경이 없는지 확인한다.
4. “main branch를 설치 코드가 강제하지 않는다 / 안정적인 main은 운영 지침뿐”이라는 현재 설명이 있다면 아래 교체 문장으로 고친다. 설치 flow와 CALL TREE에도 Git root·main 검사 단계를 추가한다. status·uninstall과 매일 루틴 실행에는 새 검사 단계가 추가된 것처럼 그리지 않는다.
5. 아래 Cubic 섹션을 추가하고 해당 코드 설명에 연결한다. 기존 테스트 설명은 아래 새 검증 내용으로 갱신한다. 과거 검증은 당시 head와 함께 구분하거나 history에 남긴다.
6. 필요한 코드 조각만 고정 Markdown 코드 블록으로 유지한다. 특히 이전 `holiday-schedule.js:201–205`의 등록 발췌는 이제 **223–227행**으로 이동했다. `launchd.js:66–71`, `79–85`의 발췌는 그대로다. 다른 source link·frame도 현재 내용과 새 원문을 대조한다.
7. 본문·source·lenses를 다시 읽고 실제 표시 범위를 확인한 뒤 leases를 종료한다. 갱신된 version과 pins를 확인해 실험 기록을 갱신한다. source widget에 범위를 지정했다는 사실만으로 실제 짧게 표시됐다고 결론 내리지 않는다.

## 기존 설명의 교체 문장

새 설치 CLI는 선택한 폴더가 실제 Git 저장소 루트이고 branch가 `main`인지 확인한다옹. `realpath`, `git rev-parse --show-toplevel`, `git branch --show-current`로 확인한 뒤 `validateStableMainCheckout`이 다른 branch나 하위 폴더를 거절해. feature worktree에서 실행한다면 `--repository /absolute/main/path`로 설치 대상을 명시해야 해. 이 검사는 install의 preview에서도 실행된다옹. [원문](review-source:head/integrations/routine/bin/holiday-schedule.js#L97-L114) · [조건 검사](review-source:head/integrations/routine/src/launchd.js#L106-L118) · [운영 안내](review-source:head/integrations/routine/README.md#L49-L51)

설치 시 확인을 통과해도 이후 폴더 이동·코드 편집·branch 변경까지 막거나 실행 버전을 고정해 주지는 않는다옹. 실행 폴더 분리와 dotfiles 복원은 모기와 논의한 후속 운영 검토이며 이번 PR의 완료 조건으로 추가하지 않았어.

## 이동한 등록 코드 조각 — 기존 발췌를 갱신

```javascript
    await rename(temporaryPath, paths.plistPath);
    await execFileAsync("/bin/launchctl", ["bootstrap", `gui/${uid}`, paths.plistPath], {
      encoding: "utf8",
      timeout: 10_000,
    });
```

[원문: integrations/routine/bin/holiday-schedule.js 223–227행](review-source:head/integrations/routine/bin/holiday-schedule.js#L223-L227)

아래 본문 두 섹션은 최신 문서의 관련 위치에 적용할 내용이다. 전체 문서를 대체하는 내용이 아니다.

---

## Cubic 리뷰 — 두 지적을 어떻게 고쳤냐옹? 😼

확인 대상은 PR #9 head `4e33226029f8aa469008d31c146d235ad1e97639`이라옹. Cubic 작성 계정은 `cubic-dev-ai[bot]`이고 원래 리뷰 대상은 `e4611acf3e89aeddabb1b330d3aa0ad1336e325a`였어. 리뷰와 작성자 답변은 2026-10-01에 조회했고, 확인 기록의 기준 시각은 05:32:10 UTC라옹. Cubic의 [리뷰 요약](https://github.com/samkimpepper/mogi-productivity/pull/9#pullrequestreview-5363368768)은 모두 대응됐다고 표시하지만, 아래 상태는 새 코드와 독립 검증도 확인해서 적은 것이라옹.

### P2 — 지울 worktree에 예약을 걸 수 있었던 문제 🐾

기존 운영 문서는 안정적인 main checkout을 쓰라고 했지만, 설치 코드는 branch를 확인하지 않았어. feature worktree의 경로도 예약에 들어갈 수 있어서, 나중에 그 폴더를 지우면 실행 대상을 잃게 되는 문제라옹. [Cubic 지적](https://github.com/samkimpepper/mogi-productivity/pull/9#discussion_r4142306170)

새 `resolveStableMainCheckout`은 `realpath`로 실제 경로를 구하고, `git rev-parse --show-toplevel`로 저장소 루트, `git branch --show-current`로 branch를 확인한다옹. 그 값을 받은 `validateStableMainCheckout`이 루트가 아니거나 branch가 main이 아니면 거절해. 이 검사는 install의 preview와 apply가 갈라지기 전에 실행돼. [Git 확인 코드](review-source:head/integrations/routine/bin/holiday-schedule.js#L97-L114) · [설치 진입점](review-source:head/integrations/routine/bin/holiday-schedule.js#L172-L199)

```javascript
  if (resolvedPath !== resolvedRoot) {
    throw new Error(`LaunchAgent repository must be a Git checkout root: ${resolvedPath}`);
  }
  if (branch !== "main") {
    throw new Error(
      `LaunchAgent repository must be the stable main checkout, not branch ${branch || "HEAD"}: ${resolvedPath}`,
    );
  }
```

[원문: integrations/routine/src/launchd.js 109–116행](review-source:head/integrations/routine/src/launchd.js#L109-L116)

상태: **수정 반영 및 독립 검증 확인**이라옹. 임시 Git 저장소·실제 feature worktree에서 설치 preview를 실행해 main 루트는 통과, feature worktree·main 하위 폴더·detached checkout은 거절되는 걸 확인했어. feature worktree에서 `--repository`로 main 루트를 명시했을 때도 preview가 통과했어. 작성자도 main 대상 preview와 feature 거절, 전체 121개 테스트 통과를 [보고했다옹](https://github.com/samkimpepper/mogi-productivity/pull/9#discussion_r4152118082). 실제 예약 등록은 이번 독립 검증에서 실행하지 않았어.

이 확인은 **설치 당시 저장소 루트와 main branch인지**를 검사하는 것이라옹. 설치 후 폴더 이동·삭제·코드 편집·branch 변경까지 막아주거나 main 코드의 버전을 고정해 주지는 않아. 전용 실행 폴더와 dotfiles 복원은 별도의 [후속 운영 검토](https://github.com/samkimpepper/mogi-productivity/pull/9#issuecomment-5925265577)로 남아 있어. 현재 설치 CLI는 detached checkout을 거절하므로, 실행 버전을 고정하는 후속 설계에서도 이 조건을 고려해야 한다옹.

### P3 — 예약 이름의 점을 다른 문자로 바꿔도 테스트가 통과할 수 있던 문제 🐈

기존 `new RegExp(HOLIDAY_ROUTINE_LAUNCHD_LABEL)`은 이름의 점(`.`)을 정규식의 “어떤 문자 하나”로 읽었어. 그래서 이름이 틀려도 검사가 통과할 수 있었고, 정규식 특수문자가 추가되면 정규식 생성 자체가 실패할 수도 있었어. 루틴 실행 동작보다 **검증 코드의 정확성**에 대한 지적이라옹. [Cubic 지적](https://github.com/samkimpepper/mogi-productivity/pull/9#discussion_r4142306182)

이제 plist에 `<string>예약 이름</string>`이라는 문자열이 실제로 들어 있는지 `includes`로 확인해. 이름을 정규식으로 해석하지 않는다옹.

```javascript
  assert.ok(plist.includes(`<string>${HOLIDAY_ROUTINE_LAUNCHD_LABEL}</string>`));
```

[원문: integrations/routine/test/launchd.test.js 20–20행](review-source:head/integrations/routine/test/launchd.test.js#L20-L20)

상태: **수정 반영 및 독립 검증 확인**이라옹. 새 문자열 검사로 바뀐 코드를 확인했고, 이 검사를 포함한 전체 121개 테스트도 직접 실행해 통과했어. [작성자 답변](https://github.com/samkimpepper/mogi-productivity/pull/9#discussion_r4152118157)과 직접 확인한 결과를 구분해서 적었다옹.

## 테스트 — 새 head에서 직접 확인한 것이라옹 😸

`4e33226`에 고정한 별도 임시 clone에서 `node --test`를 직접 실행해 **121개 통과, 실패 0개**를 확인했어. 그중 LaunchAgent 설정 테스트는 기존 4개에 main checkout 검사 1개가 추가돼 5개라옹. 새 검사는 main 루트 허용, feature branch 거절, 저장소 하위 폴더 거절을 확인해. [검사 원문](review-source:head/integrations/routine/test/launchd.test.js#L63-L88)

테스트의 문자열 입력만 확인하는 데서 그치지 않고 실제 임시 Git 저장소와 feature worktree에 `node integrations/routine/bin/holiday-schedule.js install --repository <임시 경로>`를 실행해 설치 preview도 확인했다옹. main 루트와 feature 위치에서 main을 명시한 경우는 exit 0, feature worktree·main 하위 폴더·detached checkout은 exit 1이었어. 설치 명령에는 `--apply`를 넣지 않았고, preview가 출력한 예약용 command에 `--apply`가 포함되는 것은 실제 실행과 구분해 확인했어.

`node scripts/validate-docs-impact.js --base 451ced7deb1fe0344a52b5982a6d69ebcbde5e8d --head 4e33226029f8aa469008d31c146d235ad1e97639`는 문서 검토 알림 없이 통과했어. 이 결과가 문서 내용의 정확성까지 검증한 것은 아니라옹. `validate-integrations-pr.js`는 PR의 feature branch 이름을 명시해서 실행했고, 그 branch에서는 검사를 건너뛰었다옹. 건너뜀을 실제 검사 통과로 표시하지 않아.

이번 독립 검증에서는 실제 LaunchAgent 설치·제거·kickstart, Calendar·Things 변경, 원본 저장소 변경은 하지 않았어. 작성자의 기존 실제 설치·평일 실행 보고는 새 head의 설치 검사를 실행한 결과와 구분해서 남겨줘. 첫 실제 휴일의 권한과 Today 반영은 여전히 미확인이라옹.
