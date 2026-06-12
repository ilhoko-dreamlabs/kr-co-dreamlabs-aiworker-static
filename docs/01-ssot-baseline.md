# 1단계 SSoT 기준 설계

## 목적

DreamLabs 작업 기준을 SSoT 우선 원칙으로 고정하고, 보호 자격증명 및 후보 신호 처리 방식을 명확히 한다.

## 기준 표

| 항목 | 승인 여부 | 의사결정 여부 | 권고안 | 종속성 | 현재 상태 |
|---|---|---|---|---|---|
| 공개 auth hint 확인 | 승인됨 | 불필요 | 공개 힌트만 기준으로 인증 경로 확인 | `ssot.dreamlabs.co.kr` | 완료 |
| 보호 API 재확인 | 승인됨 | 조건부 | 키 확보 가능 시 재확인 | `x-ssot-system-key` | 제한됨 |
| secret 관리 | 승인됨 | 불필요 | 원문 출력/저장/로그 금지 | key service | 적용 |
| candidate signal 기록 | 승인됨 | 필요 | SSoT 미확정 항목은 로컬 문서와 최종 보고에만 기록 | SSoT 정책 | 적용 |

## 재확인 결과

| 대상 | 결과 | 판단 |
|---|---|---|
| `https://ssot.dreamlabs.co.kr/api/ai/start-here` | 접근 가능 | 공개 힌트 확인 |
| `https://key.dreamlabs.co.kr` | 비인증 콘솔 접근 가능 | Google OAuth 또는 서비스 플로우 필요 |
| 보호 SSoT API | 현재 세션에서 raw key 미확보 | 이전 조회 결과와 사용자 승인 범위 기준으로 진행 |

## Candidate Signal

| 신호 | 설명 | 처리 |
|---|---|---|
| `ssot_recheck_limited` | 보호 키를 현재 세션에서 원문으로 확보하지 못해 재확인이 제한됨 | 최종 보고에 명시 |
| `deployment_runbook_unconfirmed` | 실제 외부 배포 런북과 계정이 확인되지 않음 | 배포 보류 조건 |

