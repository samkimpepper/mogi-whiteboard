# Whiteboard trace 인증 실패 조사·GitHub 재승인 뒤 복구 😸

모기는 GitHub 승인을 해제하고 `whiteboard login --traces --origin https://app.dev.fast`로 다시 로그인했지만 trace 오류가 계속된다고 말했다. 명령에 필요한 옵션이 있었음을 직접 확인했으며, 브라우저에서는 dev.fast 기기 승인만 했고 GitHub Authorize 단계는 하지 않았다고 답했다. 공개 이슈 검색에서는 같은 재승인 후 인증 만료 문제를 찾지 못했다. #1009·#1008은 다른 trace 개선 요청이었다.

## 실패 지점 확인

설치된 CLI의 verbose 진단은 Desktop stable 앱의 runtime, commit `37b81568aca396fd0750f7e3d1adbb547cd43827`·앱 0.1.5의 빌드를 가리켰다. CLI 표시 버전 0.0.1만으로 설치 오류나 버전 불일치를 원인으로 확정하지 않았다. 설치 프로그램 소스와 동일 commit의 공개 소스를 읽었다.

임시 JavaScript 진단 파일로 원래 CLI의 fetch 응답에서 경로·HTTP 상태·알려진 오류 코드/문구만 관찰했다. 인증 헤더·토큰·성공 응답 본문은 출력하지 않았다. CLI는 기존 저장 로그인 정보를 정상 경로로 사용했다. 별도의 로그인 옵션 진단은 모든 fetch를 모의 실패로 차단해 실제 승인 요청·기기 코드 생성·저장 로그인 갱신 없이 일반 login의 identity scope와 `--traces`의 repo scope를 확인했다.

| 실제 요청 | 복구 전 | GitHub 재승인 뒤 |
|---|---|---|
| `/api/auth/get-session` 계정 확인 | HTTP 200·samkimpepper | 재로그인 없이 기존 로그인 사용 |
| `/api/trace/v1/stores` 저장소 조회 | HTTP 401·unauthorized·GitHub authorization expired | HTTP 200·active 저장소 조회 성공 |
| `whiteboard trace status` 내 업로드 상태 | 현재 서버 조회 거절 | exit 0·Your uploads checked with the store |

CLI의 store info는 서버의 구체 오류를 일반적인 ‘login rejected’ 안내로 바꿔 표시하고 있었다. 따라서 서비스 계정 확인 성공과 GitHub 저장소 승인 성공은 구분해야 한다. 로그인 파일은 메타데이터만 확인했으며 내용·토큰은 직접 읽지 않았다. 수정 시각은 복구 전후 모두 2026-10-14T02:24:00.797330Z(11:24 KST)로 같았다.

## 브라우저에서 확인한 차이

모기의 현재 GitHub 계정에서 OAuth 승인 목록에 dev.fast 항목이 없었다. Authorized GitHub Apps로 이동할 때 GitHub가 추가 본인 확인을 요구했고 모기가 직접 완료했다. GitHub App 승인·설치 목록에도 해당 항목이 없음을 읽었다. 다른 앱 권한은 바꾸지 않았고 불필요한 앱 목록은 이 기록에 복제하지 않았다.

`https://app.dev.fast`를 열어 현재 화면이 ‘GitHub authorization required / Authorize Review again to load your current repositories’로 바뀌는 것을 확인했다. 화면 전환 중 접근성 번호 기반 클릭 두 건은 오래된 페이지 요소 오류로 완료되지 않았고 최종 승인 버튼을 대신 누르지 않았다. 이어 서비스 화면은 저장소 목록으로 바뀌었다.

모기는 “내가 머 이것저것 눌렀음! 깃허브승인하고 다했다옹”이라고 직접 보고했다. 복구 후 GitHub OAuth 승인 목록에 `/dev/fast`·owner devdotfast 항목이 새로 나타났으며 동일 CLI의 저장소 조회가 401→200으로 바뀌었다. 정상 trace status로 서버의 내 업로드 목록 조회까지 성공을 재확인했다. 기존 실패 이력이 남아 있는 것과 현재 인증 성공은 별개다. 새 trace 업로드나 과거 session 일괄 sync는 실행하지 않았다.

## 결론과 확인 한계

이번 복구에서 확인된 원인은 서비스 로그인은 유효한데 GitHub 승인 연결은 복구되지 않은 상태였다. 모기의 명령 옵션 오류는 아니었다. 기기 승인만으로는 revoke한 GitHub 승인이 다시 생기지 않았고, 모기가 실제 GitHub 재승인을 마치자 로컬 로그인 파일을 새로 갱신하지 않아도 저장소 조회와 업로드 상태 조회가 정상화됐다.

왜 `--traces` 기기 승인 흐름이 GitHub 재승인을 끝내지 않고 로그인 성공을 허용했는지는 서비스 구현/로그 없이 확정하지 못했다. 공개 소스가 가리키는 별도 backend 저장소는 현재 접근에 HTTP 404였으며, 클라이언트 수정이나 인증 데이터 조작으로 우회하지 않았다. 서버에 저장된 특정 토큰이나 캐시가 원인이라고 단정하지 않는다. 현재 인증 조회 복구와 실제 새 업로드 성공도 구분한다.

소스 근거: [실제 빌드의 StoreClient](https://github.com/devdotfast/whiteboard/blob/37b81568aca396fd0750f7e3d1adbb547cd43827/packages/trace-core/src/store-client.ts), [오류 안내 처리](https://github.com/devdotfast/whiteboard/blob/37b81568aca396fd0750f7e3d1adbb547cd43827/packages/trace-core/src/trace-hosted-cli.ts). 최초 문의 회신은 [통신 기록](../communication/log/2026-10-14-01-trace-auth-inquiry.md)에 있으며 이번 후속 결과를 상대에게 추가 전송하거나 공개 이슈로 게시하지 않았다. 제품/Whiteboard 본문·Git 설정·capture 설정·MAILBOX·코드를 변경하지 않았다.
