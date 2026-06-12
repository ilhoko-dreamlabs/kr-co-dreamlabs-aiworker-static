# 4단계 구현 설계

## 구현 순서

| 순서 | 작업 | 승인 여부 | 의사결정 여부 | 종속성 | 완료 기준 |
|---:|---|---|---|---|---|
| 1 | 프로젝트 디렉터리 생성 | 승인됨 | 완료 | `/workspace` 쓰기 권한 | 경로 존재 |
| 2 | Vite/React 설정 파일 작성 | 승인됨 | 완료 | Node.js, npm | `package.json`, `vite.config.ts` |
| 3 | 메인 화면 구현 | 승인됨 | 완료 | React, lucide-react | `src/main.tsx` |
| 4 | 스타일 작성 | 승인됨 | 완료 | CSS | 반응형 UI |
| 5 | 문서 작성 | 승인됨 | 완료 | 작업계획 | `docs/*.md` |
| 6 | 의존성 설치 | 승인됨 | 완료 필요 | npm registry | `node_modules`, lockfile |
| 7 | 타입 체크 및 빌드 | 승인됨 | 완료 필요 | 의존성 설치 | `dist/` 생성 |

## 품질 기준

| 기준 | 확인 방법 |
|---|---|
| TypeScript 오류 없음 | `npm run check` |
| 정적 빌드 가능 | `npm run build` |
| 화면 텍스트 겹침 최소화 | 반응형 CSS와 표 가로 스크롤 |
| secret 저장 없음 | 코드와 문서에 raw secret 미포함 |

## 리스크 및 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| npm registry 접근 실패 | 의존성 설치 불가 | 네트워크 재시도 또는 승인 후 재실행 |
| 배포 계정 미확인 | 운영 URL 미생성 | 빌드 산출물까지만 완료 |
| SSoT 보호 API 재확인 제한 | 최신 정책 반영 제한 | candidate signal 명시 |

