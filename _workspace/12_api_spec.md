# API 명세

## 기본 정보
- **Base URL**: /api
- **인증 방식**: PIN 헤더 (`X-User-Pin: {pin}`)
- **응답 형식**: JSON
- **성공 응답**: `{ "success": true, "data": {...} }`
- **에러 응답**: `{ "success": false, "error": { "code": "...", "message": "..." } }`

## 엔드포인트 목록

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | /api/auth | PIN 검증 | No |
| GET | /api/stats | 현재 스탯 조회 | Yes |
| PUT | /api/stats | 스탯 업데이트 | Yes |
| GET | /api/stats/history | 스탯 히스토리 (일별) | Yes |
| GET | /api/quests | 퀘스트 목록 (오늘의 데일리 포함) | Yes |
| GET | /api/quests/:id | 퀘스트 상세 | Yes |
| POST | /api/quests/:id/complete | 퀘스트 완료 처리 | Yes |
| GET | /api/streak | 연속 달성 기록 | Yes |
| POST | /api/chat | 별이 대화 (스트리밍) | Yes |
| GET | /api/chat/history | 대화 히스토리 | Yes |
| GET | /api/flags | 분기 플래그 전체 조회 | Yes |
| PUT | /api/flags | 플래그 업데이트 | Yes |
| GET | /api/titles | 획득한 칭호 목록 | Yes |
| GET | /api/spotlight | 스포트라이트 게이지 | Yes |
| GET | /api/districts | 구역 목록 + 해금 상태 | Yes |

## 상세 API

### [POST] /api/auth
PIN 검증. 세션 토큰 발급.

**요청**:
```json
{ "pin": "1234" }
```

**응답 (200)**:
```json
{
  "success": true,
  "data": { "token": "jwt_token_here", "expiresIn": 604800 }
}
```

**에러**: 401 (잘못된 PIN)

---

### [GET] /api/stats
현재 5대 스탯 조회.

**응답 (200)**:
```json
{
  "success": true,
  "data": {
    "body": { "value": 23, "level": 3, "nextLevelAt": 30 },
    "mind": { "value": 18, "level": 2, "nextLevelAt": 20 },
    "art": { "value": 25, "level": 3, "nextLevelAt": 30 },
    "knowledge": { "value": 20, "level": 2, "nextLevelAt": 20 },
    "bond": { "value": 15, "level": 2, "nextLevelAt": 20 },
    "spotlight": 62,
    "updatedAt": "2026-04-25T07:00:00Z"
  }
}
```

---

### [PUT] /api/stats
스탯 증가 (퀘스트 완료 시 내부 호출 또는 수동).

**요청**:
```json
{
  "changes": [
    { "stat": "body", "delta": 2, "reason": "workout_complete" }
  ]
}
```

**응답 (200)**:
```json
{
  "success": true,
  "data": {
    "body": { "value": 25, "level": 3, "nextLevelAt": 30, "changed": 2 },
    "levelUp": false,
    "spotlight": 64
  }
}
```

---

### [GET] /api/quests
오늘의 퀘스트 목록 (데일리 + 진행 중인 메인/사이드).

**쿼리**: `?type=daily|main|side|hidden`

**응답 (200)**:
```json
{
  "success": true,
  "data": {
    "daily": [
      {
        "id": "dq-01",
        "title": "새벽의 기상",
        "emoji": "☀️",
        "completedToday": false,
        "streak": 14,
        "statReward": { "stat": "body", "delta": 1 }
      }
    ],
    "active": [
      {
        "id": "mq-02",
        "title": "기억의 항구",
        "type": "main",
        "progress": 2,
        "totalSteps": 5,
        "currentStep": "심천호"
      }
    ]
  }
}
```

---

### [POST] /api/quests/:id/complete
퀘스트 완료 처리. 스탯 보상 자동 적용. 칭호 조건 체크.

**요청**:
```json
{
  "choice": "C"
}
```
(분기 선택이 있는 경우 choice 포함)

**응답 (200)**:
```json
{
  "success": true,
  "data": {
    "quest": { "id": "dq-02", "completedAt": "2026-04-25T07:30:00Z" },
    "rewards": {
      "stats": [{ "stat": "body", "delta": 2, "newValue": 25 }],
      "spotlight": 64,
      "streak": 15,
      "titleUnlocked": null
    },
    "starMessage": "운동 끝! 오늘도 네 몸이 조금 더 단단해졌어."
  }
}
```

---

### [POST] /api/chat
별이 대화. OpenAI 스트리밍 응답.

**요청**:
```json
{
  "message": "오늘 좀 힘들어...",
  "context": "auto"
}
```
(`context: "auto"`면 서버가 현재 스탯/퀘스트/시간대 자동 주입)

**응답**: `text/event-stream` (SSE 스트리밍)
```
data: {"content": "힘"}
data: {"content": "들"}
data: {"content": "었"}
data: {"content": "구나..."}
data: {"content": " 괜찮아,"}
data: {"content": " 오늘은"}
data: {"content": " 쉬어도 돼."}
data: [DONE]
```

---

### [GET] /api/streak
연속 달성 기록.

**응답 (200)**:
```json
{
  "success": true,
  "data": {
    "current": 14,
    "longest": 21,
    "todayCompleted": 3,
    "todayTotal": 5,
    "lastCompletedAt": "2026-04-25T06:15:00Z"
  }
}
```

---

### [GET] /api/spotlight
스포트라이트 게이지 상세.

**응답 (200)**:
```json
{
  "success": true,
  "data": {
    "gauge": 62,
    "balance": 0.78,
    "breakdown": {
      "body": { "contribution": 13, "weight": 0.2 },
      "mind": { "contribution": 10, "weight": 0.2 },
      "art": { "contribution": 15, "weight": 0.2 },
      "knowledge": { "contribution": 12, "weight": 0.2 },
      "bond": { "contribution": 9, "weight": 0.2 }
    },
    "balanceBonus": 3,
    "status": "stable"
  }
}
```

**스포트라이트 계산**:
```
spotlight = sum(각 스탯 contribution) + balanceBonus
contribution = stat_value * weight (각 0.2)
balanceBonus = 5대 스탯 표준편차가 낮을수록 높음 (0~10)
```
