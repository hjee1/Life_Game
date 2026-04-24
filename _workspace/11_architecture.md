# 아키텍처 설계 문서

## 프로젝트 개요
- **프로젝트명**: Stage (스테이지)
- **설명**: 지현우 전용 라이프 RPG — 실생활 연동 데일리 퀘스트, 5대 스탯, AI 컴패니언(별이), 스토리 진행
- **타깃 사용자**: 1명 (Jee Hyunwoo)
- **프로젝트 규모**: 소~중 (MVP → 점진적 확장)

## 기능 요구사항

| # | 기능 | 설명 | 우선순위 |
|---|------|------|---------|
| FR-1 | 데일리 퀘스트 | 5개 데일리 퀘스트 체크/완료/연속 추적 | P0 |
| FR-2 | 5대 스탯 | 체/심/예/지/연 스탯 추적, 레벨업, 히스토리 | P0 |
| FR-3 | 별이 대화 | OpenAI 기반 AI 컴패니언 채팅 (스탯/퀘스트 컨텍스트 반영) | P0 |
| FR-4 | 스포트라이트 게이지 | 5대 스탯 균형 기반 종합 게이지 | P0 |
| FR-5 | 대시보드 | 스탯, 퀘스트, 별이 대사, 구역 네비게이션 통합 화면 | P0 |
| FR-6 | 구역 맵 | 5+2 구역 선택, 구역별 컨텐츠 | P1 |
| FR-7 | 메인 퀘스트 | MQ-01~05 스토리 진행, 분기 선택 | P1 |
| FR-8 | 사이드 퀘스트 | SQ-01~10, 해금 조건, 보상 | P1 |
| FR-9 | 칭호/업적 | 달성 조건 기반 칭호 획득, 프로필 표시 | P1 |
| FR-10 | 시간대별 UI | 실시간 시간에 따른 배경/인사 변화 | P1 |
| FR-11 | 플래그 시스템 | 분기 플래그 저장/조회, 엔딩 분기 | P2 |
| FR-12 | 온보딩 | 3단계 슬라이드, 캐릭터 생성, 별이 소개 | P2 |

## 비기능 요구사항

| # | 항목 | 요구사항 |
|---|------|---------|
| NFR-1 | 성능 | 대시보드 로딩 < 2초, 별이 응답 < 5초 |
| NFR-2 | 모바일 | 375px 모바일 퍼스트, 반응형 |
| NFR-3 | 인증 | 단일 유저이므로 간단한 PIN/비밀번호 |
| NFR-4 | 데이터 | 매일 스탯/퀘스트 기록 영구 보존 |
| NFR-5 | 배포 | milkfolio.space 서브도메인 |

## 기술 스택

| 구분 | 기술 | 선택 근거 |
|------|------|----------|
| 프레임워크 | **Next.js 14 (App Router)** | SSR+API Routes 통합, Vercel 배포 최적 |
| 스타일링 | **Tailwind CSS** | 유틸리티 퍼스트, 빠른 UI 개발 |
| 상태관리 | **Zustand** | 경량, 5대 스탯/퀘스트 전역 상태 |
| DB | **Supabase (PostgreSQL)** | 무료 티어, REST API 내장, 실시간 가능 |
| ORM | **Prisma** | 타입 안전, 마이그레이션, Supabase 호환 |
| AI | **OpenAI API (GPT-4o)** | 별이 대화, 유저가 이미 키 보유 |
| 인증 | **간단 PIN 미들웨어** | 단일 유저, 복잡한 인증 불필요 |
| 폰트 | **Galmuri11 + Pretendard** | 픽셀 게임 느낌 + 가독성 |
| 배포 | **Vercel** | Next.js 최적, 무료 티어, 커스텀 도메인 |
| 패키지 매니저 | **pnpm** | 빠른 설치, 디스크 효율 |

## 시스템 아키텍처

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│  Next.js     │────▶│  Supabase    │
│  (Mobile)    │◀────│  (Vercel)    │◀────│  (PostgreSQL)│
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  OpenAI API  │
                     │  (GPT-4o)    │
                     └──────────────┘
```

- **브라우저**: 모바일 PWA (출퇴근 열차 사용)
- **Next.js**: 프론트엔드 + API Routes (서버리스)
- **Supabase**: 스탯/퀘스트/플래그/대화 기록 저장
- **OpenAI**: 별이 대화 생성 (컨텍스트에 스탯/퀘스트 포함)

## 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (폰트, 테마)
│   ├── page.tsx                # 대시보드 (메인)
│   ├── districts/
│   │   └── [id]/page.tsx       # 구역 상세
│   ├── quests/
│   │   └── [id]/page.tsx       # 퀘스트 상세
│   ├── chat/
│   │   └── page.tsx            # 별이 대화
│   ├── profile/
│   │   └── page.tsx            # 프로필/칭호
│   ├── onboarding/
│   │   └── page.tsx            # 온보딩
│   └── api/
│       ├── stats/
│       │   └── route.ts        # GET/PUT 스탯
│       ├── quests/
│       │   ├── route.ts        # GET 퀘스트 목록
│       │   └── [id]/
│       │       └── complete/
│       │           └── route.ts # POST 퀘스트 완료
│       ├── chat/
│       │   └── route.ts        # POST 별이 대화
│       ├── flags/
│       │   └── route.ts        # GET/PUT 플래그
│       └── auth/
│           └── route.ts        # POST PIN 검증
├── components/
│   ├── ui/                     # Button, Card, Badge, ProgressBar, Modal
│   ├── layout/                 # Header, BottomNav, ThemeProvider
│   └── features/
│       ├── dashboard/          # StatCard, QuestCheckList, SpotlightGauge
│       ├── chat/               # ChatBubble, ChatInput, StarAvatar
│       ├── districts/          # DistrictMap, DistrictCard
│       └── quests/             # QuestCard, QuestDetail, RewardPopup
├── hooks/
│   ├── useStats.ts             # 스탯 CRUD
│   ├── useQuests.ts            # 퀘스트 CRUD
│   ├── useChat.ts              # 별이 대화
│   ├── useTimeOfDay.ts         # 시간대별 테마
│   └── useStreak.ts            # 연속 달성 추적
├── lib/
│   ├── db.ts                   # Prisma 클라이언트
│   ├── openai.ts               # OpenAI 클라이언트
│   ├── game-logic.ts           # 스탯 계산, 스포트라이트 게이지, 레벨업
│   ├── star-prompt.ts          # 별이 시스템 프롬프트 + 컨텍스트 빌더
│   └── constants.ts            # 스탯 이름, 구역 데이터, 퀘스트 정의
├── stores/
│   └── game-store.ts           # Zustand 스토어 (스탯, 퀘스트, 플래그)
├── types/
│   └── index.ts                # Stat, Quest, Flag, ChatMessage, District 타입
└── prisma/
    ├── schema.prisma
    ├── migrations/
    └── seed.ts                 # 초기 데이터 (퀘스트, 구역, 칭호 정의)

public/
├── fonts/
│   └── Galmuri11.woff2
└── images/                     # 픽셀아트 에셋 (향후 추가)
```

## 프론트엔드 전달 사항
- 모바일 퍼스트 (375px), Tailwind 반응형
- 대시보드가 메인: 스탯 5개 + 퀘스트 체크리스트 + 별이 한마디 + 구역 네비
- 시간대별 CSS 변수 전환 (useTimeOfDay 훅)
- 파티클/애니메이션: CSS transition 기본, 체크 완료 시 confetti 라이브러리 가능
- PWA manifest 설정 (홈 화면 추가)

## 백엔드 전달 사항
- API Routes는 /api/ 하위에 RESTful
- Prisma + Supabase PostgreSQL
- 별이 대화: POST /api/chat → OpenAI 스트리밍 응답
- 스탯 계산 로직은 lib/game-logic.ts에 집중
- PIN 인증 미들웨어 (환경변수 USER_PIN)

## QA 전달 사항
- 핵심 플로우: 데일리 체크 → 스탯 변화 → 연속 기록 → 별이 반응
- 경계값: 스탯 레벨업 임계값, 연속 기록 리셋 조건 (자정 기준)
- OpenAI 응답 실패 시 폴백 대사 확인

## DevOps 전달 사항
- Vercel 배포 + 커스텀 도메인 (stage.milkfolio.space 또는 서브 경로)
- 환경변수: DATABASE_URL, OPENAI_API_KEY, USER_PIN, NEXT_PUBLIC_APP_URL
- Supabase 무료 티어 (500MB DB, 충분)
