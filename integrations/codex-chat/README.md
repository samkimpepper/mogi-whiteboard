# 화이트보드냥 대화 원문 저장

mogi-productivity의 codex-chat 구현을 이 기록소에 맞게 가져왔다. 외부 패키지 설치 없이 Node.js로 실행한다.

- `Stop`: 답변이 끝날 때 `.local/chat-archive/live/<session-id>.md`를 갱신한다.
- `SessionEnd`: `.local/chat-archive/final/날짜_첫발화--<session-id>.md`에 최종본도 저장한다.
- 모기 발화와 화이트보드냥 진행·최종 답변을 표시 순서대로 저장한다. 본문 텍스트의 줄바꿈과 끝 공백도 유지한다.
- 도구 호출·결과, reasoning, system/developer 지침, 주입된 환경 문맥은 제외한다. 이미지·첨부 바이너리는 저장하지 않으며 현재 파서는 텍스트 외 콘텐츠를 만나면 오류로 알리고 이전 정상본을 보존한다.
- 같은 세션을 반복 저장해도 내용이 같으면 다시 쓰지 않는다. 최종본을 사람이 수정한 경우 덮어쓰지 않고 오류로 알린다.
- 이 저장소의 primary worktree에만 적용한다. 별도 subagent 훅은 등록하지 않는다.

원문은 기존 `.gitignore`의 `/.local/` 규칙으로 Git에서 제외한다. 훅은 커밋·푸시하지 않는다. 세션 종료 인계는 기존 `handoff/`에 따로 남긴다. 마지막 답변 뒤나 클라이언트 종료 때 원문이 갱신되어도 Git 작업 폴더가 더러워지지 않는다. 최종본 생성이 늦어져도 마지막 성공한 Stop 저장본을 live에서 읽을 수 있다.

## 활성화

`.codex/hooks.json`에 Stop·SessionEnd를 등록했다. 2026-10-06 모기가 활성화했고 로컬 설정에서 두 훅의 trusted_hash와 enabled = true를 확인했다. 새 환경에 설치하거나 훅 정의를 변경한 경우 프로젝트 세션의 `/hooks`에서 다음 명령을 사용하는 두 훅을 확인하고 trust한다. 현재 세션에 새 설정이 나타나지 않으면 새 세션에서 확인한다. trust 설정을 직접 조작하거나 우회하지 않는다.

```sh
node "$(git rev-parse --show-toplevel)/integrations/codex-chat/bin/archive-hook.js"
```

실제 lifecycle 자동 실행은 활성화 후 확인해야 한다. 단순히 대화로 종료 인계를 요청하는 것은 Codex의 SessionEnd 발생과 다르다.

## 검증·오류

```sh
node --test integrations/codex-chat/test/*.test.js
```

임시 fixture로 메시지 필터링·순서·원문 보존·반복 저장·파일 충돌·손상된 입력·다른 저장소/linked worktree 제외를 검증한다. 실제 대화 원문을 테스트 출력에 노출하지 않는다.

실패 시 `.local/chat-archive/live/<session-id>.error.json`에 내용 없는 오류 코드를 기록한다. Stop 실패는 경고를 표시하고 턴을 막지 않으며 SessionEnd 실패는 오류 종료한다. 다음 저장 성공 때 해당 오류 파일을 지운다. Codex transcript 형식이 달라지면 추측해 저장하지 않고 파서를 수정한다.
