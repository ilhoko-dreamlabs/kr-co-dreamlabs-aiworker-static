# DreamLabs Worker Static

DreamLabs 대표 Worker를 홍보하고 블로그형 업데이트와 외부 채널을 연결하는 정적 웹 프로젝트입니다.

## 운영 URL

| 항목 | 값 |
|---|---|
| 목표 production URL | `https://worker.dreamlabs.co.kr` |
| 배포 방식 | Vercel 정적 프론트엔드 + Vercel Functions API 프록시 |
| Vercel 프로젝트 | `kr-co-dreamlabs-aiworker-static` |
| Vercel 프로젝트 ID | `prj_TyCtJh6vXu4cqcj8UZH93LyInANz` |
| Vercel org ID | `team_v0Ku5wzd28j7Ki2iAIBZamGa` |
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

## Worker Chat API

브라우저는 `/api/chat`만 호출하고, Vercel Function이 서버에서
`https://worker0.dreamlabs.co.kr/api/v1/requests` Remote Request API에 프록시합니다.
Remote Request API key는 브라우저 번들에 포함하지 않습니다.

Vercel 프로젝트 환경변수에 아래 값을 입력합니다.

```bash
REMOTE_REQUEST_API_URL=https://worker0.dreamlabs.co.kr/api/v1/requests
REMOTE_REQUEST_API_KEY=<REMOTE_REQUEST_API_KEY>
```

주의: `REMOTE_REQUEST_API_KEY`에는 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.

챗봇 질문/응답 로그는 `www.dreamlabs.co.kr`과 같은 Chat Insight Postgres/Neon DB에 저장합니다.
DB URL 우선순위는 `CHAT_INSIGHTS_DATABASE_URL` → `DATABASE_URL` → `POSTGRES_URL`입니다.

```bash
CHAT_INSIGHTS_DATABASE_URL=<shared-chat-insight-postgres-url>
CHAT_SITE_DOMAIN=worker.dreamlabs.co.kr
CHAT_SITE_ID=worker-dreamlabs-co-kr
CHAT_SITE_DISPLAY_NAME=DreamLabs Worker
CHAT_SITE_TYPE=operations
```

DB URL은 서버 함수에서만 읽으며 브라우저 번들에 포함하지 않습니다. 원천 저장 테이블은
기존 `chat_sites`, `chat_sessions`, `chat_messages`, `lead_insights`를 사용하고 `site_id`로
사이트별 데이터를 분리합니다.

GitHub Actions 배포를 사용하려면 GitHub repository secrets에 아래 값을 입력합니다.

```bash
VERCEL_TOKEN=<VERCEL_TOKEN>
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
| `docs/07-aiworker-domain-migration-plan.md` | `worker.dreamlabs.co.kr` 배포 전환 설계 |

## 배포

Vercel 배포는 `main` 브랜치 push 시 `.github/workflows/vercel.yml`이 실행합니다.
빌드 산출물은 `dist/`이며, 서버 함수는 `api/` 디렉터리에서 제공합니다.

```bash
npm run build
```

`https://worker.dreamlabs.co.kr` 루트 도메인으로 배포하기 위해 Vite `base`는 `/`로 설정합니다.
Vercel 전환 후 DNS는 Vercel에서 안내하는 CNAME/A 레코드 기준으로 변경합니다.

## 운영 주의사항

- 기존 공개 URL 변경, 자산 삭제, DNS/SSL 변경, production 배포는 명시 승인 후 수행합니다.
- `REMOTE_REQUEST_API_KEY`는 Vercel 서버 환경변수에만 저장합니다.
- `CHAT_INSIGHTS_DATABASE_URL`, `DATABASE_URL`, `POSTGRES_URL` 원문은 로그와 보고에 출력하지 않습니다.
- 커밋, 푸시, PR 생성은 별도 승인 항목으로 기록합니다.
- 텔레그램 보고는 발송 도구 또는 봇 토큰이 제공된 경우에만 실제 발송할 수 있습니다.
