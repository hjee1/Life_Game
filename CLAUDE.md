# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Life_Game

Personal Life RPG game for Jee Hyunwoo (Terry, 지현우). See `.claude/CLAUDE.md` for full project spec.

### Quick Context
- **What:** Life Simulation RPG + AI Companion web app
- **Who:** Single user — Jee Hyunwoo, Data Engineer & aspiring actor
- **Style:** Stardew Valley-like cozy progression with real-life integration
- **Stack:** Next.js + Tailwind + OpenAI API
- **Domain:** milkfolio.space | **GitHub:** hjee1
- **Teams:** 3 agent teams (15 agents total) — Game Narrative, Visual Storytelling, Fullstack Webapp

### Key Commands
- `/life-game` — Full pipeline across all 3 teams
- `/visual-storytelling` — Visual team pipeline
- `/fullstack-webapp` — Webapp team pipeline

### Structure
```
Life_Game/
├── .claude/
│   ├── CLAUDE.md                    — Full project spec & user profile
│   ├── agents/                      — 15 agent definitions (3 teams x 5)
│   └── skills/                      — 10 skills (3 orchestrators + 7 extensions)
├── _workspace/                      — Design documents & planning (created at runtime)
├── src/                             — Source code (created during webapp build)
└── CLAUDE.md                        — This file
```

### Language
- Korean with English technical terms
- Commit + push after every meaningful change
