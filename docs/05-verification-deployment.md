# 5단계 검증 및 배포 설계

## 검증 계획

| 검증 | 승인 여부 | 명령 | 성공 기준 | 종속성 |
|---|---|---|---|---|
| 의존성 설치 | 승인됨 | `npm install` | lockfile 생성, 패키지 설치 | npm registry |
| 타입 체크 | 승인됨 | `npm run check` | TypeScript 오류 없음 | 의존성 |
| 빌드 | 승인됨 | `npm run build` | `dist/` 생성 | 의존성 |
| 로컬 실행 | 승인됨 | `npm run dev` 또는 `npm run preview` | URL 접속 가능 | Vite |

## GitHub Pages 배포 설계

| 항목 | 현재 판단 | 권고 |
|---|---|---|
| 배포 플랫폼 | GitHub Pages | 정적 산출물 배포에 적합 |
| 저장소명 | `kr-co-dreamlabs-aiworker-static` | 프로젝트명과 일치 |
| 기본 브랜치 | `main` | 소스 코드 기준 브랜치 |
| Vite base | `/kr-co-dreamlabs-aiworker-static/` | 프로젝트 Pages URL 대응 |
| 배포 방식 | `gh-pages` 브랜치 직접 배포 | 현재 GitHub token에 `workflow` scope가 없어 Actions workflow 업로드 불가 |
| 도메인 연결 | 미결정 | 이번 작업에서는 기본 Pages URL 우선 |

## GitHub 배포 절차

| 순서 | 작업 | 승인 여부 | 의사결정 여부 | 종속성 |
|---:|---|---|---|---|
| 1 | 로컬 Git 저장소 초기화 | 승인됨 | 불필요 | Git |
| 2 | GitHub Pages 배포 경로 구성 | 승인됨 | 불필요 | GitHub Pages |
| 3 | 타입 체크 및 빌드 재검증 | 승인됨 | 불필요 | npm |
| 4 | GitHub 원격 저장소 생성 | 승인됨 | GitHub 권한 필요 | GitHub 인증 |
| 5 | `main` 브랜치 푸시 | 승인됨 | GitHub 권한 필요 | GitHub 인증 |
| 6 | Pages 배포 확인 | 승인됨 | 불필요 | Pages 전파 |

## 2026-06-12 GitHub 배포 결과

| 항목 | 결과 |
|---|---|
| GitHub owner | `ilhoko-dreamlabs` |
| 대상 저장소 | `ilhoko-dreamlabs/kr-co-dreamlabs-aiworker-static` |
| 저장소 생성 | SSoT `GITHUB_TOKEN`을 메모리에서만 사용해 GitHub API로 생성 |
| 원격 업로드 | GitHub Git API로 `main` 브랜치 커밋 생성 |
| GitHub Pages | `dist/` 산출물을 `gh-pages` 브랜치에 직접 업로드 |
| 로컬 `gh` CLI | 미설치 |
| 로컬 GitHub HTTPS 인증 | 사용하지 않음 |
| SSoT secret 처리 | 원문 토큰 출력/저장/로그 기록 없음 |
| 실제 배포 | GitHub 저장소 업로드 완료, Pages `gh-pages` 소스 설정 완료 |

## 운영 확인 항목

| 확인 항목 | 상태 | 비고 |
|---|---|---|
| GitHub 저장소 URL | 완료 | `https://github.com/ilhoko-dreamlabs/kr-co-dreamlabs-aiworker-static` |
| Pages URL | 전파 확인 필요 | `https://ilhoko-dreamlabs.github.io/kr-co-dreamlabs-aiworker-static/` |
| 도메인 연결 | 보류 | 별도 도메인 정책 미확정 |
| Secret 원문 관리 | 완료 | SSoT/GitHub token 원문 미출력, 미저장 |
