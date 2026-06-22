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
| 목표 production URL | `https://aiworker.dreamlabs.co.kr` | 커스텀 도메인 루트 기준 |
| Vite base | `/` | 커스텀 도메인 루트 배포 대응 |
| CNAME | `aiworker.dreamlabs.co.kr` | `public/CNAME`으로 산출물 포함 |
| 배포 방식 | `gh-pages` 브랜치 직접 배포 | 현재 GitHub token에 `workflow` scope가 없어 Actions workflow 업로드 불가 |
| 도메인 연결 | 필요 | GitHub Pages custom domain과 DNS 상태 확인 필요 |

## GitHub 반영 및 배포 절차

| 순서 | 작업 | 승인 여부 | 의사결정 여부 | 종속성 |
|---:|---|---|---|---|
| 1 | 로컬 변경 검토 | 승인됨 | 불필요 | Git |
| 2 | 타입 체크 및 빌드 재검증 | 승인됨 | 불필요 | npm |
| 3 | 커밋 생성 | 승인됨, 완료 | `chore: prepare aiworker custom domain deployment` | Git |
| 4 | 원격 브랜치 푸시 | 승인됨, 완료 | `main` 직접 반영 | GitHub 인증 |
| 5 | PR 생성 또는 직접 gh-pages 배포 | 승인됨, 완료 | `gh-pages` 직접 배포 | GitHub 권한 |
| 6 | Pages 배포 확인 | 수행 | GitHub Pages 리다이렉트 확인, DNS 미해결 | Pages 전파, DNS |

## 기존 2026-06-12 GitHub 배포 이력

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
| 실제 배포 | 당시 GitHub 저장소 업로드 및 Pages `gh-pages` 소스 설정 완료 |

## 2026-06-22 현재 작업 판단

이번 작업은 `https://aiworker.dreamlabs.co.kr` 커스텀 도메인 기준으로 `main` 커밋/푸시와 `gh-pages` 배포까지 수행했다. GitHub Pages 기본 URL은 custom domain으로 리다이렉트되지만, production URL은 DNS 해석 실패로 최종 접속 검증이 완료되지 않았다.

## 운영 확인 항목

| 확인 항목 | 상태 | 비고 |
|---|---|---|
| GitHub 저장소 URL | 완료 | `https://github.com/ilhoko-dreamlabs/kr-co-dreamlabs-aiworker-static` |
| 목표 production URL | DNS 확인 필요 | `https://aiworker.dreamlabs.co.kr` |
| Pages URL | 확인됨 | `https://ilhoko-dreamlabs.github.io/kr-co-dreamlabs-aiworker-static/`가 custom domain으로 301 리다이렉트 |
| 도메인 연결 | 부분 완료 | `gh-pages/CNAME` 반영 완료, DNS 해석 불가 |
| Secret 원문 관리 | 완료 | SSoT/GitHub token 원문 미출력, 미저장 |

## 배포 후 production 검증 절차

| 순서 | 확인 항목 | 명령 또는 방법 | 성공 기준 |
|---:|---|---|---|
| 1 | production URL 응답 | `curl -I https://aiworker.dreamlabs.co.kr` | HTTP 200 또는 정상 정적 응답 |
| 2 | HTML asset 경로 | 브라우저 개발자 도구 또는 `curl` | `/assets/...` 경로가 404 아님 |
| 3 | CNAME 산출물 | `cat dist/CNAME` | `aiworker.dreamlabs.co.kr` |
| 4 | 화면 동작 | 브라우저 확인 | 운영 상태 화면이 에러 없이 표시 |
| 5 | 캐시 영향 | 강력 새로고침 또는 다른 네트워크 | 이전 asset 경로 잔존 여부 확인 |

## 롤백 기준

| 상황 | 롤백 권고 |
|---|---|
| production URL이 에러 페이지 표시 | 직전 정상 `gh-pages` 커밋으로 되돌림 |
| asset 경로 404 발생 | Vite base와 배포 산출물 경로 재확인 후 재배포 |
| DNS/SSL 불일치 | 코드 롤백보다 DNS/GitHub Pages 설정 점검 우선 |
