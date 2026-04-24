# 배포 가이드

## 인프라 구성

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│   Vercel     │───▶│  Supabase    │    │  OpenAI API  │
│  (Next.js)   │    │  (PostgreSQL)│    │  (GPT-4o)    │
│              │───▶│              │    │              │
│  CDN + Edge  │    │  무료 티어    │    │  Pay-as-you  │
└─────────────┘    └──────────────┘    └──────────────┘
       │
       ▼
┌─────────────┐
│   GitHub     │
│  (hjee1)     │
│  CI/CD 트리거 │
└─────────────┘
```

## 환경변수

| 변수명 | 설명 | 설정 위치 |
|--------|------|----------|
| `DATABASE_URL` | Supabase PostgreSQL 연결 문자열 | Vercel + .env.local |
| `DIRECT_URL` | Supabase Direct 연결 (Prisma 마이그레이션용) | Vercel + .env.local |
| `OPENAI_API_KEY` | OpenAI API 키 | Vercel + .env.local |
| `USER_PIN` | 사용자 인증 PIN (해시) | Vercel + .env.local |
| `JWT_SECRET` | JWT 서명 시크릿 | Vercel + .env.local |
| `NEXT_PUBLIC_APP_URL` | 앱 공개 URL | Vercel |

## 1단계: Supabase 설정

### 프로젝트 생성
1. [supabase.com](https://supabase.com) → New Project
2. Region: **Northeast Asia (Seoul)** — 한국 사용자 최적
3. Database Password 설정 → 안전하게 보관

### 연결 문자열 확인
```
Settings → Database → Connection string → URI
```
- `DATABASE_URL`: Transaction 모드 (포트 6543)
- `DIRECT_URL`: Session 모드 (포트 5432) — Prisma 마이그레이션용

### RLS (Row Level Security)
- 단일 유저이므로 **RLS OFF** (API Routes에서 PIN 인증으로 충분)
- Supabase Dashboard 직접 접근은 본인만 가능

## 2단계: Vercel 배포

### 초기 설정
```bash
# Vercel CLI 설치
pnpm add -g vercel

# 프로젝트 연결
cd Life_Game
vercel link

# 환경변수 설정
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add OPENAI_API_KEY
vercel env add USER_PIN
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_APP_URL
```

### vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "crons": [
    {
      "path": "/api/cron/daily-reset",
      "schedule": "0 15 * * *"
    }
  ]
}
```

> **Cron 설명**: `0 15 * * *` = UTC 15:00 = KST 자정 00:00 → 데일리 퀘스트 리셋

### 빌드 설정
- Framework: Next.js (자동 감지)
- Build Command: `pnpm build`
- Output: `.next`
- Node.js: 20.x

## 3단계: 도메인 설정

### 커스텀 도메인
```bash
# Vercel에 도메인 추가
vercel domains add stage.milkfolio.space
```

### DNS 설정 (milkfolio.space 관리 패널)
```
Type: CNAME
Name: stage
Value: cname.vercel-dns.com
TTL: 300
```

### SSL
- Vercel이 자동으로 Let's Encrypt 인증서 발급
- 별도 설정 불필요

## 4단계: Prisma 마이그레이션

```bash
# 로컬에서 마이그레이션 생성
pnpm prisma migrate dev --name init

# 프로덕션 마이그레이션 (Supabase에 직접)
pnpm prisma migrate deploy

# 시드 데이터 투입
pnpm prisma db seed
```

### 시드 데이터 목록
| 테이블 | 데이터 | 개수 |
|--------|--------|------|
| quests | 데일리 5 + 메인 5 + 사이드 10 + 히든 3 | 23 |
| titles | 칭호 정의 | 11 |
| districts | 구역 정의 (5+2) | 7 |
| stats | 초기 스탯 (모두 0) | 1행 |
| streaks | 초기 streak | 1행 |

## 5단계: CI/CD 파이프라인

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm build

  # Vercel 자동 배포 (GitHub 연동 시 별도 deploy job 불필요)
  # main push → Vercel이 자동으로 Production 배포
```

### 배포 흐름
```
git push → GitHub Actions (test + build) → Vercel (자동 배포)
                                             ├── Preview (PR 브랜치)
                                             └── Production (main 브랜치)
```

## 6단계: 모니터링

### Vercel Analytics (무료)
- Web Vitals (LCP, FID, CLS)
- 서버리스 함수 실행 시간
- 에러 로그

### 핵심 모니터링 포인트

| 항목 | 임계값 | 알림 방법 |
|------|--------|----------|
| 대시보드 LCP | < 2초 | Vercel Dashboard |
| 별이 응답 시간 | < 5초 | API Route 로깅 |
| OpenAI API 에러율 | < 5% | 폴백 대사 트리거 |
| Supabase 용량 | < 400MB (500MB 중) | 월 1회 수동 체크 |

### 비용 추정 (월간)

| 서비스 | 플랜 | 예상 비용 |
|--------|------|----------|
| Vercel | Hobby (무료) | $0 |
| Supabase | Free (500MB) | $0 |
| OpenAI API | Pay-as-you-go | ~$5-15 (별이 대화 기준) |
| 도메인 | milkfolio.space (기존) | $0 추가 |
| **합계** | | **~$5-15/월** |

> OpenAI 비용 절감: 별이 대화 분당 5회 제한 + 컨텍스트 토큰 최적화

## 롤백 전략

```bash
# Vercel 즉시 롤백 (이전 배포로)
vercel rollback

# 또는 Vercel Dashboard → Deployments → 이전 버전 → Promote to Production
```

### DB 롤백
```bash
# Prisma 마이그레이션 롤백 (주의: 데이터 유실 가능)
pnpm prisma migrate resolve --rolled-back <migration_name>
```

> 중요: DB 마이그레이션 전 항상 Supabase Dashboard에서 백업 확인

## 체크리스트

### 배포 전
- [ ] 환경변수 모두 설정 (Vercel)
- [ ] Supabase 프로젝트 생성 + 연결 확인
- [ ] Prisma 마이그레이션 + 시드 완료
- [ ] `pnpm build` 로컬 성공
- [ ] `pnpm test` 전체 통과
- [ ] PWA manifest 설정

### 배포 후
- [ ] stage.milkfolio.space 접속 확인
- [ ] SSL 인증서 확인
- [ ] PIN 로그인 동작
- [ ] 데일리 퀘스트 체크 동작
- [ ] 별이 대화 스트리밍 동작
- [ ] 모바일 (375px) 레이아웃 확인
- [ ] Cron Job (자정 리셋) 동작 확인
