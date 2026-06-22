# 전체 수행 지시문

아래 지시문은 이 작업을 처음부터 끝까지 수행하도록 Codex에 전달하기 위한 복붙용 문안이다.

```text
한국어로 대화한다.

DreamLabs external 범위의 정적 프로젝트 `kr-co-dreamlabs-aiworker-static`를 `/workspace/github/kr-co-dreamlabs-aiworker-static`에서 운영 URL `https://aiworker.dreamlabs.co.kr` 기준으로 정비하고, 권고안대로 완료하라.

작업 기준:
- 작업 모드: 기존 저장소 배포 준비 및 운영 문서 정비
- 제품 범위: DreamLabs external
- 대상 경로: `/workspace/github/kr-co-dreamlabs-aiworker-static`
- 목표 production URL: `https://aiworker.dreamlabs.co.kr`
- 배포 플랫폼 기준: GitHub Pages `gh-pages` 브랜치
- SSoT 원문 secret, 보호 payload, 토큰 값은 출력/저장/로그 기록하지 않는다.
- SSoT 보호 API 재확인이 가능한 경우 헤더 `x-ssot-system-key`로 재확인하되, 키가 불가하면 `ssot_recheck_limited` candidate signal로 남긴다.

권고안:
- Vite `base`는 커스텀 도메인 루트 배포에 맞춰 `/`로 설정한다.
- `public/CNAME`에 `aiworker.dreamlabs.co.kr`을 추가해 `dist/CNAME`이 생성되도록 한다.
- UI는 운영형, 신뢰 중심, 한국어 기본, 반응형, 접근성 고려 방향으로 구현한다.
- 과장된 랜딩 페이지가 아니라 작업 상태를 바로 이해할 수 있는 실제 정적 화면을 첫 화면으로 둔다.
- 단계별 설계문서, 승인/의사결정/종속성 표, 배포 판단 문서를 `docs/`에 저장한다.
- `npm run check`, `npm run build`로 검증한다.
- 커밋, 푸시, PR, production 배포는 사용자가 승인한 범위 안에서만 수행한다.
- 단계 완료 시 텔레그램 보고가 요구되지만, 현재 세션에 텔레그램 발송 도구 또는 봇 토큰이 없으면 실제 발송은 보류하고 발송용 메시지를 보고한다.

완료 기준:
- 목표 도메인 기준 설정 반영
- 단계별 설계문서 저장 완료
- 타입 체크와 빌드 통과
- 빌드 산출물에 `CNAME` 포함 확인
- 변경 파일과 검증 결과 보고
- 배포 수행 여부, 보류 사유, 텔레그램 보고 가능 여부 최종 보고
```

## 승인 및 결정 상태

| 항목 | 상태 | 비고 |
|---|---|---|
| 대상 경로 점검 | 승인됨 | 사용자 일괄 승인 |
| 기술 스택 | 결정됨 | Vite + TypeScript + React + npm |
| 설계문서 작성 | 승인됨 | 단계별 Markdown 문서 |
| 구현 | 승인됨 | `aiworker.dreamlabs.co.kr` 기준 배포 준비 |
| 검증 | 승인됨 | typecheck/build |
| 실제 외부 배포 | 승인 필요 | 사용자가 production 배포를 명시 지시할 때 수행 |
| 텔레그램 보고 | 조건부 | 발송 도구 또는 토큰 제공 시 실제 발송 |
