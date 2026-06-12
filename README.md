# DreamLabs AI Worker Static

DreamLabs external 범위의 AI Worker 운영 상태를 정리하는 정적 웹 프로젝트입니다.

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

## 배포

GitHub Pages 배포 워크플로는 `.github/workflows/deploy-github-pages.yml`에 정의되어 있습니다.

```bash
npm run build
```

저장소가 GitHub에 생성되고 `main` 브랜치에 푸시되면 GitHub Actions가 `dist/`를 Pages artifact로 배포합니다.
