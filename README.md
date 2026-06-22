# DreamLabs AI Worker Static

DreamLabs external 범위의 AI Worker 운영 상태를 정리하는 정적 웹 프로젝트입니다.

## 운영 URL

| 항목 | 값 |
|---|---|
| 목표 production URL | `https://aiworker.dreamlabs.co.kr` |
| 배포 방식 | GitHub Pages `gh-pages` 브랜치 정적 배포 |
| 커스텀 도메인 파일 | `public/CNAME` |
| Vite base | `/` |

## 실행

```bash
npm install
npm run dev
```

## 검증

```bash
npm run check
npm run build
```

## 문서

단계별 설계문서는 `docs/`에 저장되어 있습니다.

| 문서 | 내용 |
|---|---|
| `docs/00-execution-instruction.md` | 전체 수행 지시문 |
| `docs/01-ssot-baseline.md` | SSoT 기준과 candidate signal |
| `docs/02-project-architecture.md` | 프로젝트 아키텍처 |
| `docs/03-ui-content-design.md` | UI 및 콘텐츠 설계 |
| `docs/04-implementation-plan.md` | 구현 계획 |
| `docs/05-verification-deployment.md` | 검증 및 배포 판단 |
| `docs/06-final-report.md` | 최종 작업 보고 |
| `docs/07-aiworker-domain-migration-plan.md` | `aiworker.dreamlabs.co.kr` 배포 전환 설계 |

## 배포

GitHub Pages 배포는 `dist/` 산출물을 `gh-pages` 브랜치에 직접 업로드하는 방식입니다.

```bash
npm run build
```

`https://aiworker.dreamlabs.co.kr` 루트 도메인으로 배포하기 위해 Vite `base`는 `/`로 설정하고, `public/CNAME`을 통해 빌드 산출물에 `CNAME`이 포함되도록 유지합니다.

## 운영 주의사항

- 기존 공개 URL 변경, 자산 삭제, DNS/SSL 변경, production 배포는 명시 승인 후 수행합니다.
- 커밋, 푸시, PR 생성은 별도 승인 항목으로 기록합니다.
- 텔레그램 보고는 발송 도구 또는 봇 토큰이 제공된 경우에만 실제 발송할 수 있습니다.
