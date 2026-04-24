# 테스트 계획

## 테스트 전략

### 테스트 레벨
| 레벨 | 도구 | 범위 | 목표 커버리지 |
|------|------|------|-------------|
| Unit | Jest + React Testing Library | 순수 함수, 게임 로직, 유틸리티 | 90%+ |
| Integration | Jest + Supertest | API Routes + Prisma + DB | 80%+ |
| E2E | Playwright | 핵심 유저 플로우 | 주요 5개 시나리오 |
| Visual | Storybook + Chromatic (선택) | 컴포넌트 렌더링 | 핵심 UI 컴포넌트 |

### 테스트 환경
- **Unit/Integration**: `.env.test` — 로컬 Supabase 또는 테스트 DB
- **E2E**: Vercel Preview 배포 또는 로컬 `next dev`
- **CI**: GitHub Actions — PR마다 Unit + Integration 자동 실행

---

## Unit 테스트

### 게임 로직 (`lib/game-logic.ts`)

| 테스트 ID | 대상 함수 | 시나리오 | 기대 결과 |
|-----------|----------|---------|----------|
| U-01 | `calculateLevel()` | 경험치 0 → 레벨 1 | level = 1 |
| U-02 | `calculateLevel()` | 경험치 10 → 레벨 2 경계 | level = 2 |
| U-03 | `calculateLevel()` | 경험치 99 → 최대 레벨 근처 | 올바른 레벨 반환 |
| U-04 | `calculateSpotlight()` | 5대 스탯 균등 (각 20) | 높은 밸런스 보너스 |
| U-05 | `calculateSpotlight()` | 스탯 편중 (하나만 100) | 낮은 밸런스 보너스 |
| U-06 | `calculateSpotlight()` | 모든 스탯 0 | spotlight = 0 |
| U-07 | `calculateBalanceBonus()` | 표준편차 0 | 최대 보너스 (10) |
| U-08 | `calculateBalanceBonus()` | 표준편차 높음 | 보너스 ≈ 0 |
| U-09 | `applyStatChange()` | 정상 증가 delta=+2 | 스탯 증가, 히스토리 기록 |
| U-10 | `applyStatChange()` | 레벨업 임계값 도달 | levelUp = true |
| U-11 | `checkTitleCondition()` | streak ≥ 7 | "새벽의 전사" 해금 |
| U-12 | `checkTitleCondition()` | 조건 미달 | unlocked = false |

### 별이 프롬프트 (`lib/star-prompt.ts`)

| 테스트 ID | 시나리오 | 기대 결과 |
|-----------|---------|----------|
| U-13 | 시간대=새벽, 스탯 정상 | 새벽 인사 + 격려 컨텍스트 포함 |
| U-14 | 연속 달성 7일 | streak 축하 컨텍스트 포함 |
| U-15 | 퀘스트 미완료 상태 | 독촉 없이 부드러운 컨텍스트 |
| U-16 | 컨텍스트 길이 제한 | max token 초과 시 자름 |

### Zustand 스토어 (`stores/game-store.ts`)

| 테스트 ID | 시나리오 | 기대 결과 |
|-----------|---------|----------|
| U-17 | 초기 상태 | 5대 스탯 모두 0, 퀘스트 빈 배열 |
| U-18 | updateStat('body', +2) | body 값 2 증가 |
| U-19 | completeQuest('dq-01') | 해당 퀘스트 completedToday = true |
| U-20 | resetDailyQuests() | 모든 데일리 completedToday = false |

---

## Integration 테스트

### API 엔드포인트

| 테스트 ID | Method | Path | 시나리오 | 기대 |
|-----------|--------|------|---------|------|
| I-01 | POST | /api/auth | 올바른 PIN | 200 + JWT 토큰 |
| I-02 | POST | /api/auth | 잘못된 PIN | 401 에러 |
| I-03 | GET | /api/stats | 인증 후 조회 | 200 + 5대 스탯 |
| I-04 | GET | /api/stats | 인증 없음 | 401 에러 |
| I-05 | PUT | /api/stats | 스탯 +2 변경 | 200 + 업데이트 확인 |
| I-06 | PUT | /api/stats | 잘못된 stat_name | 400 에러 |
| I-07 | GET | /api/quests | 데일리 목록 조회 | 200 + 퀘스트 배열 |
| I-08 | POST | /api/quests/dq-01/complete | 정상 완료 | 200 + 보상 + 스탯 변경 |
| I-09 | POST | /api/quests/dq-01/complete | 이미 완료된 퀘스트 | 409 중복 방지 |
| I-10 | POST | /api/chat | 정상 메시지 | SSE 스트림 응답 |
| I-11 | POST | /api/chat | 빈 메시지 | 400 에러 |
| I-12 | GET | /api/streak | 연속 기록 조회 | 200 + streak 데이터 |
| I-13 | GET | /api/spotlight | 게이지 조회 | 200 + breakdown |
| I-14 | GET | /api/titles | 칭호 목록 | 200 + unlocked 상태 |
| I-15 | GET | /api/districts | 구역 목록 | 200 + 해금 상태 |

### DB 트랜잭션

| 테스트 ID | 시나리오 | 기대 |
|-----------|---------|------|
| I-16 | 퀘스트 완료 → 스탯 증가 → 히스토리 기록 | 3개 테이블 동시 업데이트, 부분 실패 시 롤백 |
| I-17 | 자정 크론 → 데일리 리셋 | streak 계산 정확, last_completed_date 갱신 |
| I-18 | 동시 퀘스트 완료 요청 | race condition 없이 1회만 처리 |

---

## E2E 테스트 (Playwright)

### 핵심 시나리오

| 테스트 ID | 시나리오 | 단계 |
|-----------|---------|------|
| E-01 | **데일리 퀘스트 완료 플로우** | PIN 로그인 → 대시보드 → 퀘스트 체크 → 보상 팝업 → 스탯 변화 확인 |
| E-02 | **별이 대화 플로우** | 대시보드 → 채팅 진입 → 메시지 전송 → 스트리밍 응답 수신 → 대화 기록 확인 |
| E-03 | **스탯 확인 플로우** | 대시보드 → 스탯 상세 → 히스토리 그래프 확인 |
| E-04 | **구역 네비게이션** | 대시보드 → 구역 맵 → 구역 선택 → 구역 컨텐츠 확인 |
| E-05 | **연속 달성 확인** | 로그인 → 데일리 전체 완료 → streak 증가 → 칭호 해금 (조건 충족 시) |

### 모바일 뷰포트

| 테스트 ID | 시나리오 | 뷰포트 |
|-----------|---------|--------|
| E-06 | 대시보드 레이아웃 | 375×812 (iPhone) |
| E-07 | 하단 네비게이션 터치 | 375×812 |
| E-08 | 채팅 키보드 올라옴 | 375×667 |

---

## 경계값 테스트

| ID | 케이스 | 기대 |
|----|-------|------|
| BV-01 | 스탯 레벨업 정확히 경계값 (예: 10→11에서 레벨 2) | 레벨업 트리거 |
| BV-02 | 스탯 0 미만 방지 | 최소 0 |
| BV-03 | 자정 직전/직후 퀘스트 완료 | 올바른 날짜 기록 |
| BV-04 | streak 1일 끊김 후 리셋 | current=0, longest 유지 |
| BV-05 | 동일 퀘스트 같은 날 2회 완료 시도 | 2회차 거부 |
| BV-06 | 별이 대화 OpenAI 타임아웃 | 폴백 메시지 표시 |
| BV-07 | 매우 긴 채팅 메시지 (1000자+) | 정상 처리 또는 길이 제한 |
| BV-08 | spotlight 전체 스탯 0일 때 | spotlight = 0, 에러 없음 |

---

## 테스트 실행 명령어

```bash
# Unit + Integration
pnpm test

# 특정 파일
pnpm test -- game-logic.test.ts

# 커버리지
pnpm test:coverage

# E2E
pnpm test:e2e

# E2E 특정 시나리오
pnpm test:e2e -- --grep "데일리 퀘스트"
```

## CI 파이프라인

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:coverage
      - run: pnpm build  # 빌드 검증
```
