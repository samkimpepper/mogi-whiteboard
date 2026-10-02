# 2026-10-02 — 확인용 메타데이터의 시각적 비중 😸

모기는 각 섹션의 commit head·읽은 범위 같은 메타데이터가 필요하지만 설명을 읽을 때 방해되므로 글자를 연하게 처리해 쉽게 넘기고 싶다고 요청했다.

현재 Whiteboard stable 설치 앱의 렌더러와 스키마를 읽기 전용으로 확인했다. 안전한 Markdown의 HTML은 실제 스타일 요소가 아니라 텍스트로 렌더링되고, 문장별 색 지정 필드는 없다. section의 defaultCollapsed는 지원되며 접힌 제목에는 기존 CSS의 ghost 색이 적용된다. 설치 앱은 변경하지 않았다.

지원되는 대안으로 접힌 ‘확인 근거’를 사용한다고 모기에게 설명하고 PR #10 리뷰에 적용했다. version 59 → 76에서 비교 commit·trace 조회 상태·Cubic 조회 시점·테스트 실행 명령 및 각 설명의 trace 이벤트 번호를 7개 근거 칸으로 분리했다. 설명·원문 인용·코드 발췌·소스 링크·테스트 결과·작성자 보고와 독립 확인의 구분은 보존했다. 기존 block ID도 보존했다. base/head pins는 그대로이고 새 head 코드 검증이나 repin은 수행하지 않았다.

도구로 전체 문서를 다시 읽고 defaultCollapsed 7개, 기존 ID 보존, pins 불변, staleSources 빈 목록을 확인했다. 이벤트 참조를 분리한 문장의 부호도 수정하고 재조회했다. 앱 CSS와 문서 구조의 확인이며 실제 화면 캡처·색 대비 측정이나 모기의 읽기 효과 확인은 아직 없다.

선호 정본은 DECISIONS, 작성 안내는 PROMPTS에 연결하고 STATE에 version 76을 반영했다. MAILBOX 통신 실험은 모기의 대기 지시대로 시작하지 않았다. MAILBOX 전달·원본 mogi-productivity 수정·커밋·푸시는 하지 않았다.
