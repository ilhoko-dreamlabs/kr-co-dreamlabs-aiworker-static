# 전체 수행 지시문

아래 지시문은 이 작업을 처음부터 끝까지 수행하도록 Codex에 전달하기 위한 복붙용 문안이다.

```text
한국어로 대화한다.

DreamLabs external 범위의 신규 정적 프로젝트 `kr-co-dreamlabs-aiworker-static`를 `/workspace/github/kr-co-dreamlabs-aiworker-static`에 생성하고, 권고안대로 처음부터 끝까지 완료하라.

작업 기준:
- Starter Chat Session ID: `asc_20260612082136004_476debcf`
- 작업 모드: 신규 프로젝트 생성
- 제품 범위: DreamLabs external
- 대상 경로: `/workspace/github/kr-co-dreamlabs-aiworker-static`
- SSoT 원문 secret, 보호 payload, 토큰 값은 출력/저장/로그 기록하지 않는다.
- SSoT 보호 API 재확인이 가능한 경우 헤더 `x-ssot-system-key`로 재확인하되, 키가 불가하면 `ssot_recheck_limited` candidate signal로 남긴다.

권고안:
- 기술 스택은 Vite + TypeScript + React + npm으로 진행한다.
- UI는 운영형, 신뢰 중심, 한국어 기본, 반응형, 접근성 고려 방향으로 구현한다.
- 과장된 랜딩 페이지가 아니라 작업 상태를 바로 이해할 수 있는 실제 정적 화면을 첫 화면으로 둔다.
- 단계별 설계문서, 승인/의사결정/종속성 표, 배포 판단 문서를 `docs/`에 저장한다.
- `npm install`, `npm run check`, `npm run build`로 검증한다.
- 승인된 배포 런북과 계정이 확인되지 않으면 실제 외부 배포는 보류하고, 빌드 산출물과 보류 사유를 최종 보고한다.

완료 기준:
- 프로젝트 파일 생성 완료
- 단계별 설계문서 저장 완료
- 타입 체크와 빌드 통과
- 로컬 실행 URL 또는 빌드 산출물 경로 보고
- 배포 수행 여부, 보류 사유, candidate signal 최종 보고
```

## 승인 및 결정 상태

| 항목 | 상태 | 비고 |
|---|---|---|
| 대상 경로 생성 | 승인됨 | 사용자 일괄 승인 |
| 기술 스택 | 결정됨 | Vite + TypeScript + React + npm |
| 설계문서 작성 | 승인됨 | 단계별 Markdown 문서 |
| 구현 | 승인됨 | 정적 웹 앱 |
| 검증 | 승인됨 | typecheck/build |
| 실제 외부 배포 | 조건부 승인 | 승인된 런북 확인 시 수행, 미확인 시 보류 |

