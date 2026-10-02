# 2026-10-02 — Whiteboard 맥 시스템 폰트 적용 😸

## 요청과 조사

모기가 Whiteboard의 한글이 궁서체처럼 보인다고 관찰하고, 서브에이전트에게 맥 시스템 폰트로 바꾸는 방법을 조사해 달라고 요청했다. 조사 후 실제 적용도 요청했다. 조사·앱 수정은 같은 서브에이전트가 담당했다.

Whiteboard stable 0.1.5의 설정 화면에는 폰트 선택 항목이 없었다. 공식 소스와 설치 앱 CSS에서 본문·제목의 `--font-serif`가 `"Newsreader", Georgia, serif`로 지정된 것을 확인했다. 한글 serif fallback이 사용자 관찰의 원인일 가능성은 있으나, 원래 화면의 실제 렌더링 폰트 이름을 확정하지 않았다.

- 공식 선언: https://github.com/devdotfast/whiteboard/blob/v0.1.5/packages/review/app/src/styles.css#L13
- 설정 화면: https://github.com/devdotfast/whiteboard/blob/v0.1.5/packages/review/app/src/settings-page.tsx

## 적용과 검증

설치 앱 전체를 `/Users/leechaerim/.dev/whiteboard-font-backups/2026-10-02-084905/Whiteboard.original.app`에 백업하고, CSS 변수 값 한 곳을 다음으로 교체했다.

```css
--font-serif: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif;
```

앱 파일 변경에 따라 개발사 서명은 로컬 ad-hoc 서명으로 바뀌었으며 외곽 앱의 hardened-runtime 플래그도 제거했다. 원본 백업과 수정 앱 모두 `codesign --verify --deep --strict` 검증을 통과했다. 코드·다이어그램의 별도 고정폭 폰트 변수는 수정하지 않았다.

`computer-use` 스킬로 현재 PR #10이 열려 있음을 확인하고, 사용자에게 재시작을 안내한 뒤 앱을 재실행했다. stable 0.1.5 실행과 CLI 연결이 정상이며, 리뷰 `698dff95-527d-41c2-9229-ccc59ef49539`로 복귀했다. 서브에이전트가 화면에서 제목·본문이 고딕 형태로 바뀐 것을 확인했다. 실제 computed/rendered font 이름까지 확인한 것은 아니다.

이 변경은 설치 앱의 로컬 패치다. 앱 업데이트나 재설치 때 원래 폰트로 돌아갈 수 있다. 원복은 수정 앱을 종료한 뒤 전체 원본 백업을 설치 앱 위치에 복원하는 방식이다. 리뷰 데이터·문서 내용·pins와 mogi-productivity 원본은 변경하지 않았다. 기록소 변경은 아직 커밋·푸시하지 않았다.

## 재현·복구 파일

- 수정 CSS: `/Applications/Whiteboard.app/Contents/Resources/app/out/vs/review/canvas/assets/canvas-B1i6tLYR.css`
- 백업 폴더의 `manifest.json`, `canvas.original.css`, `font-rule.diff`, `restore-original.sh`에 근거와 원복 절차가 있다.
- 원본 CSS SHA256: `6dbe0e845fd5c97dfde074a22c50409698e56afbb68bd3c72dc14e4cee37d06b`
- 수정 CSS SHA256: `af8692a6b10f7db3a5df6271b820abbf3ff75f494d549b842ba4426d3bc62b84`

Whiteboard를 종료한 뒤 다음 명령으로 원본 앱과 개발사 서명을 복구할 수 있다.

```sh
zsh /Users/leechaerim/.dev/whiteboard-font-backups/2026-10-02-084905/restore-original.sh
```

재시작 후 Community 가입 팝업이 나타났다. 지원되는 `whiteboard app launch --focus --json`으로 활성화하고 새 화면을 읽은 뒤 `Not now` 클릭을 재시도했지만 `window_not_focused`로 입력이 전달되지 않았다. 팝업은 남아 있으며 사용자에게 직접 `Not now`를 누르도록 안내했다. 권한 거절이나 자동 승인 거절로 해석하지 않는다.

## 사용자 확인

적용 후 모기가 “잘된다옹!”이라고 확인했다. 시스템 폰트 변경이 실제 사용에서도 잘 동작한다는 사용자 관찰이다. 팝업을 어떤 방식으로 닫았는지나 실제 렌더링 폰트 이름까지 확인한 답변으로 확대하지 않는다.
