# 5단계 검증 및 배포

## 검증 기준

| 검증 | 명령 | 성공 기준 |
|---|---|---|
| 의존성 설치 | `npm ci --include=dev` | lockfile 기준 설치 완료 |
| 타입 체크 | `npm run check` | TypeScript 오류 없음 |
| 빌드 | `npm run build` | `dist/` 산출물 생성 |
| CNAME | `cat dist/CNAME` | `worker.dreamlabs.co.kr` |
| 패키지 감사 | `npm audit --include=dev` | 취약점 0건 |
| 외부 에셋 | `curl -I -L assets.dreamlabs.co.kr/...` | HTTP 200 |

## GitHub Pages 배포 설계

| 항목 | 값 |
|---|---|
| 저장소 | `ilhoko-dreamlabs/kr-co-dreamlabs-aiworker-static` |
| production URL | `https://worker.dreamlabs.co.kr` |
| Pages 방식 | GitHub Actions |
| 워크플로 | `.github/workflows/pages.yml` |
| 빌드 산출물 | `dist/` |
| CNAME 원본 | `public/CNAME` |
| Vite base | `/` |

## 배포 흐름

| 순서 | 작업 | 완료 기준 |
|---:|---|---|
| 1 | `main` 브랜치에 소스 push | 원격 커밋 반영 |
| 2 | GitHub Actions build job | `npm ci --include=dev`, `npm run build` 성공 |
| 3 | Pages artifact 업로드 | `dist/` 업로드 |
| 4 | Pages deploy job | `github-pages` environment에 게시 |
| 5 | production 검증 | `https://worker.dreamlabs.co.kr/` 정상 응답 |

## 롤백 기준

| 상황 | 조치 |
|---|---|
| production URL이 에러 페이지 표시 | 직전 정상 커밋으로 되돌린 뒤 Actions 재배포 |
| asset 경로 404 발생 | Vite base, CNAME, dist 산출물을 재확인 |
| DNS/SSL 불일치 | 코드 롤백보다 DNS와 GitHub Pages custom domain 설정 점검 우선 |
