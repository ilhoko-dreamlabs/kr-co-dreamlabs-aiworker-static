# 4단계 구현 설계

## 구현 순서

| 순서 | 작업 | 승인 여부 | 의사결정 여부 | 종속성 | 완료 기준 |
|---:|---|---|---|---|---|
| 1 | 저장소 상태 확인 | 승인됨 | 완료 | 로컬 클론 | 현재 브랜치와 로컬 변경 파악 |
| 2 | Vite base 수정 | 승인됨 | 완료 | 목표 도메인 확정 | `base: "/"` |
| 3 | CNAME 추가 | 승인됨 | 완료 | GitHub Pages custom domain | `public/CNAME` 존재 |
| 4 | 화면 문구 정합성 확인 | 승인됨 | 완료 | 운영 URL 기준 | production URL과 배포 상태 문구 일치 |
| 5 | 문서 갱신 | 승인됨 | 완료 | 작업계획 | `docs/*.md` 갱신 |
| 6 | 타입 체크 및 빌드 | 승인됨 | 완료 | 의존성 | `dist/` 생성, `dist/CNAME` 포함 |
| 7 | 배포 전 보고 | 승인됨 | 완료 | 검증 결과 | 변경 요약, 리스크, 승인 필요 항목 보고 |

## 품질 기준

| 기준 | 확인 방법 |
|---|---|
| TypeScript 오류 없음 | `npm run check` |
| 정적 빌드 가능 | `npm run build` |
| 커스텀 도메인 산출물 포함 | `test -f dist/CNAME && cat dist/CNAME` |
| 화면 텍스트 겹침 최소화 | 반응형 CSS와 표 가로 스크롤 |
| secret 저장 없음 | 코드와 문서에 raw secret 미포함 |

## 리스크 및 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| npm registry 접근 실패 | 의존성 설치 불가 | 네트워크 재시도 또는 승인 후 재실행 |
| DNS가 GitHub Pages를 가리키지 않음 | `aiworker.dreamlabs.co.kr` 접속 실패 | DNS/Pages 설정 확인 후 별도 승인 절차로 조치 |
| GitHub Pages custom domain 미설정 | CNAME만으로 운영 반영 불완전 | Pages 설정 확인 또는 gh-pages 배포 후 production 검증 |
| SSoT 보호 API 재확인 제한 | 최신 정책 반영 제한 | candidate signal 명시 |
