# 7단계 aiworker.dreamlabs.co.kr 배포 전환 설계

## 목적

`kr-co-dreamlabs-aiworker-static` 저장소를 GitHub Pages 커스텀 도메인 `https://aiworker.dreamlabs.co.kr` 기준으로 배포할 수 있게 준비한다.

## 단계별 작업계획

| 순서 | 단계 | 승인여부 | 의사결정사항 | 권고안 | 종속성 | 완료 기준 |
|---:|---|---|---|---|---|---|
| 1 | 현재 저장소 상태 점검 | 승인됨 | 없음 | 변경 전 `git status` 확인 | 로컬 클론 | 워킹트리 기준 파악 |
| 2 | 목표 production URL 확정 | 승인됨 | 완료: `https://aiworker.dreamlabs.co.kr` | 문서와 설정을 동일 기준으로 통일 | 사용자 지시 | 모든 문서에 목표 URL 반영 |
| 3 | Vite base 전환 | 승인됨 | 완료: `/` | 커스텀 도메인 루트 배포는 `/` 권고 | 목표 URL 확정 | 빌드 HTML asset 경로가 `/assets/...` |
| 4 | CNAME 산출물 포함 | 승인됨 | 완료: `public/CNAME` | Vite public 파일로 관리 | GitHub Pages | `dist/CNAME` 생성 |
| 5 | 단계별 설계문서 갱신 | 승인됨 | 완료 | 기존 docs에 최소 변경으로 반영 | 2-4 | 승인/의사결정/권고안/종속성 표 갱신 |
| 6 | 로컬 검증 | 승인됨 | 명령 실패 시 원인 분석 | `npm run check`, `npm run build` 실행 | 의존성 | 타입 체크와 빌드 통과 |
| 7 | GitHub 반영 | 승인 필요 | 커밋/푸시/PR 방식 결정 | feature branch와 PR 권고 | 검증 통과 | 커밋 또는 PR 준비 |
| 8 | production 배포 | 명시 승인 필요 | 배포 시점과 롤백 커밋 확정 | `gh-pages` 배포 후 즉시 검증 | GitHub 반영 | `https://aiworker.dreamlabs.co.kr` 정상 응답 |
| 9 | 단계 완료 텔레그램 보고 | 조건부 | 발송 수단 제공 필요 | 봇 토큰/채팅방 ID 또는 외부 발송 도구 필요 | 보고 채널 | 실제 발송 또는 발송문 제공 |

## 의사결정 기록

| 항목 | 결정 | 근거 |
|---|---|---|
| 운영 URL | `https://aiworker.dreamlabs.co.kr` | 사용자 명시 |
| Vite base | `/` | 커스텀 도메인 루트에서 asset URL 안정화 |
| CNAME 위치 | `public/CNAME` | Vite 빌드 산출물에 자동 포함 |
| 배포 전 검증 | typecheck/build/CNAME 확인 | 정적 배포 실패 위험 축소 |
| 텔레그램 보고 | 조건부 수행 | 현재 세션에 발송 도구와 인증정보 없음 |

## 단계 완료 보고 메시지 템플릿

```text
[DreamLabs AI Worker Static]
단계 완료: {단계명}
대상 저장소: kr-co-dreamlabs-aiworker-static
목표 URL: https://aiworker.dreamlabs.co.kr
결과: {완료/실패/보류}
검증: {실행한 검증}
다음 단계: {다음 작업}
승인 필요: {필요한 승인 또는 없음}
```
