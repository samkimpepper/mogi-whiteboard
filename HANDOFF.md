# Whiteboard 실험 인계

이 저장소는 Whiteboard를 실제 코드 이해에 써 보고, 모기에게 유효했던 표현과 부족했던 점만 기록하는 개인 실험 기록소다. 동결한 `mogi-cards`/과외냥이 하네스를 다시 만드는 프로젝트가 아니다. 반복해서 관찰되지 않은 기능, 자동화, taxonomy, dashboard 등을 먼저 만들지 않는다.

## 지금 어디까지 왔나

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

1. 이 파일과 `sessions/2026-09-29-mogi-productivity-pr7.md`를 읽는다.
2. 첫 리뷰 읽기는 완료됐다. 모기의 다음 실제 질문이나 작업에 맞춰 이어간다.
3. 다음 설명부터 쉬운 말과 실제 명령어·함수명을 함께 표기한다.
4. 질문이 나오면 대상 코드의 실제 근거로 답하고, 저장소·PR·질문·확인한 답을 세션 문서에 즉시 기록한다.
5. 설명을 고쳐 달라는 요청이 있을 때만 Whiteboard 리뷰를 한 군데씩 수정하고 새 version을 기록한다. 필요할 때 stable 인스턴스와 앱에서 위 리뷰 ID를 연다.
6. 다음 표현 실험을 진행한다면 필요한 코드 한 부분의 발췌와 설명부터 시도한다. 실제로 읽게 되는지는 관찰 전까지 결론 내리지 않는다.

Whiteboard CLI 상태 확인은 다음 명령으로 할 수 있다.

```sh
/Users/leechaerim/.local/bin/whiteboard instances
/Users/leechaerim/.local/bin/whiteboard api session_list '{}'
```

앱에서 리뷰 제목 또는 ID로 찾으면 된다. 문서를 다시 수정할 때는 먼저 Whiteboard authoring instructions를 읽고 document lease를 새로 얻는다. 지난 lease는 만료됐다고 가정한다.

## 기록 파일 역할

- `STATE.md`: 현재 실험, 현재 결론, 모르는 것, 다음 행동
- `DECISIONS.md`: 과외냥이 동결과 Whiteboard 우선 실험의 경계
- `PROMPTS.md`: 실제 사용한 프롬프트 원문과 다음에 바꿀 문장 최대 1개
- `sessions/2026-09-29-mogi-productivity-pr7.md`: 읽는 도중 나온 질문, 관찰, 수정 결과

`STATE.md`와 세션 문서는 읽기 완료와 실제 사용 소감에 맞게 갱신했다.

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

이 질문들은 아직 답을 채우지 않는다. 다음 프롬프트 후보 한 문장은 `PROMPTS.md`에 기록했다. 앞으로도 실제로 말한 것과 시도해 확인한 결과만 기록한다.
