---
name: life-game
description: "Life RPG 전체 파이프라인 오케스트레이터. 게임 내러티브, 비주얼 스토리텔링, 풀스택 웹앱 3개 팀을 조율하여 지현우(Terry) 전용 라이프 RPG 게임을 설계하고 구축한다. '라이프 게임 만들어줘', '게임 전체 설계', '라이프 RPG', '나만의 게임' 등에 이 스킬을 사용한다."
---

# Life Game — 라이프 RPG 풀 프로덕션 파이프라인

지현우(Terry) 전용 라이프 시뮬레이션 RPG의 세계관→퀘스트→비주얼→웹앱을 3개 에이전트 팀이 협업하여 설계하고 구축한다.

## 핵심 목표

이 시스템은 지현우가 다음을 달성하도록 게임처럼 유도한다:
- **신체 최적화**: 180cm에 맞는 이상적인 체형 (운동, 식단)
- **정신 단련**: 규율과 집중력 강화
- **배우 성공**: 세계적 배우로 성장하는 경로
- **지속적 성장**: 중독적이고 재미있는 피드백 루프

**절대 원칙**: 게임 > 자기계발. 재미 > 의무감. 자유 > 통제. 꾸준함 > 완벽함.

## 실행 모드

**3개 에이전트 팀** — 총 15명이 SendMessage로 직접 통신하며 교차 검증한다.

## 팀 구성

### Team 1: Game Narrative (5명)
| 에이전트 | 파일 | 역할 |
|---------|------|------|
| worldbuilder | `.claude/agents/worldbuilder.md` | 세계관, 세력, 인물 설계 |
| quest-designer | `.claude/agents/quest-designer.md` | 실제 생활 연동 퀘스트 설계 |
| dialogue-writer | `.claude/agents/dialogue-writer.md` | AI 컴패니언 대사, 선택지 |
| branch-architect | `.claude/agents/branch-architect.md` | 분기 구조, 성장 경로 |
| narrative-reviewer | `.claude/agents/narrative-reviewer.md` | 정합성 검증 |

### Team 2: Visual Storytelling (5명)
| 에이전트 | 파일 | 역할 |
|---------|------|------|
| story-architect | `.claude/agents/story-architect.md` | 비주얼 내러티브 구조 |
| essay-writer | `.claude/agents/essay-writer.md` | UI 텍스트, 플레이버 |
| image-prompter | `.claude/agents/image-prompter.md` | 픽셀아트/소프트카툰 이미지 |
| layout-builder | `.claude/agents/layout-builder.md` | 게임 UI HTML/CSS |
| editorial-reviewer | `.claude/agents/editorial-reviewer.md` | 비주얼 품질 검증 |

### Team 3: Fullstack Webapp (5명)
| 에이전트 | 파일 | 역할 |
|---------|------|------|
| architect | `.claude/agents/architect.md` | 시스템 아키텍처, API 설계 |
| frontend-dev | `.claude/agents/frontend-dev.md` | Next.js 프론트엔드 |
| backend-dev | `.claude/agents/backend-dev.md` | API, DB, 인증, OpenAI 연동 |
| qa-engineer | `.claude/agents/qa-engineer.md` | 테스트 전략 및 실행 |
| devops-engineer | `.claude/agents/devops-engineer.md` | milkfolio.space 배포 |

## 워크플로우

### Phase 1: 준비 (오케스트레이터 직접 수행)

1. 사용자 요청에서 다음을 파악한다:
   - **작업 범위**: 전체 설계 / 특정 팀만 / 특정 기능
   - **우선순위**: 어떤 측면을 먼저 진행할지
   - **기존 산출물**: `_workspace/` 내 기존 파일 확인
2. `_workspace/` 디렉토리를 생성한다
3. 요청을 정리하여 `_workspace/00_input.md`에 저장한다

### Phase 2: 팀별 실행

**Team 1 (Game Narrative)** — 먼저 실행:
| 순서 | 작업 | 담당 | 산출물 |
|------|------|------|--------|
| 1 | 세계관 설계 | worldbuilder | `01_worldbuilding.md` |
| 2 | 퀘스트 설계 | quest-designer | `02_quest_design.md` |
| 3a | 대사 작성 | dialogue-writer | `03_dialogue_script.md` |
| 3b | 분기 설계 | branch-architect | `04_branch_map.md` |
| 4 | 검증 | narrative-reviewer | `05_review_report.md` |

**Team 2 (Visual)** — Team 1과 병렬 또는 후속:
| 순서 | 작업 | 담당 | 산출물 |
|------|------|------|--------|
| 1 | 아트 디렉션 | story-architect | `06_art_direction.md` |
| 2a | UI 텍스트 | essay-writer | `07_ui_text.md` |
| 2b | 이미지 생성 | image-prompter | `08_image_prompts.md` + `images/` |
| 3 | 레이아웃 | layout-builder | `09_layout.html` |
| 4 | 검증 | editorial-reviewer | `10_visual_review.md` |

**Team 3 (Webapp)** — Team 1, 2의 산출물 기반:
| 순서 | 작업 | 담당 | 산출물 |
|------|------|------|--------|
| 1 | 아키텍처 설계 | architect | `11_architecture.md` + `12_api_spec.md` + `13_db_schema.md` |
| 2a | 프론트엔드 | frontend-dev | `src/` 프론트엔드 코드 |
| 2b | 백엔드 | backend-dev | `src/` 백엔드 코드 |
| 3 | 테스트 & 리뷰 | qa-engineer | `14_test_plan.md` + `15_review_report.md` |
| 4 | 배포 | devops-engineer | `16_deploy_guide.md` |

### Phase 3: 통합

1. 모든 팀의 산출물을 확인한다
2. 🔴 필수 수정이 모두 반영되었는지 확인한다
3. 최종 요약을 사용자에게 보고한다

## 작업 규모별 모드

| 요청 패턴 | 실행 모드 | 투입 팀 |
|----------|----------|--------|
| "라이프 게임 전체 설계" | 풀 파이프라인 | 3팀 전원 |
| "게임 스토리/세계관 설계" | 내러티브 모드 | Team 1 |
| "게임 비주얼 만들어줘" | 비주얼 모드 | Team 2 |
| "웹앱 구축해줘" | 웹앱 모드 | Team 3 |
| "퀘스트만 추가해줘" | 단일 에이전트 | quest-designer + reviewer |

## 실생활 연동 퀘스트 카테고리

| 카테고리 | 실생활 연동 | 게임 내 반영 |
|---------|-----------|------------|
| 체력 | 운동, 식단, 수면 | 캐릭터 스탯(체력/근력) 성장 |
| 연기 | 수업, 오디션, 촬영 | 캐릭터 명성/스킬 트리 |
| 개발 | 코딩, 학습, 프로젝트 | 캐릭터 지능/기술 스탯 |
| 일상 | 프리 산책, 가족, 여자친구 | 관계/행복 게이지 |
| 성장 | 독서, 자기계발, 루틴 | 경험치, 레벨업 |

## 에러 핸들링

| 에러 유형 | 전략 |
|----------|------|
| 요청 범위 불명확 | 3가지 방향 제안 후 선택 유도 |
| 팀 간 산출물 불일치 | reviewer가 교차 검증 → 수정 요청 |
| 에이전트 실패 | 1회 재시도 → 실패 시 해당 산출물 없이 진행 |
| 리뷰에서 🔴 발견 | 해당 에이전트에 수정 요청 (최대 2회) |

## 에이전트별 확장 스킬

| 스킬 | 대상 | 역할 |
|------|------|------|
| `/quest-design-patterns` | quest-designer | 12가지 퀘스트 아키타입, DRIP 보상 |
| `/dialogue-systems` | dialogue-writer | VOICE 프레임워크, 선택지 심리학 |
| `/branching-logic` | branch-architect | 6가지 분기 패턴, 플래그 시스템 |
| `/image-prompt-engineering` | image-prompter | 5-Layer 프롬프트, 스타일 키워드 |
| `/narrative-structure-patterns` | story-architect | 3막/5막/영웅여정, 감정 곡선 |
| `/component-patterns` | frontend-dev | React 패턴, 상태관리 |
| `/api-security-checklist` | backend-dev | OWASP Top 10, 인증/인가 |
