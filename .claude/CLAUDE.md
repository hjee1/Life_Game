# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Life_Game — Personal Life RPG for Jee Hyunwoo

A multi-agent AI system that designs and builds a personalized web-based life RPG game for a single user: **Jee Hyunwoo (Terry, 지현우)**.

This is NOT a productivity tool. This is a real-life integrated self-improvement system **disguised as a game**. The system synchronizes with the user's real-world life and continuously evolves with him.

## User Profile

- **Name:** Jee Hyunwoo (지현우), stage name: 서해우 (Seo Hae-woo)
- **Born:** 1994.04.18 | **Height:** 180cm | **Weight:** 60kg
- **Day Job:** Data Engineer at Hanwha System (~4 years), learning Harness Engineering
- **Dream:** World-class actor (active since ~2023, Netflix credits, short film lead)
- **Commute:** 3 hours round trip (Paju ↔ Euljiro), wake 05:50
- **Weekly:** Acting class Wed 18:00, girlfriend Fri-Sat, family chapel Sun
- **Pet:** Pree (poodle)
- **Goals:** Physically optimized body, mentally sharp, professionally successful actor, game-like feedback loops

## Core Game Concept

- **Genre:** Life Simulation RPG + Personal AI Companion
- **Style:** Cozy, character-growth focused (Stardew Valley emotional tone + modern AI)
- **Key Features:**
  - User is the main character (custom avatar resembling Jee Hyunwoo)
  - Persistent AI companion (smart in-game guide)
  - Real-life actions → in-game progression
  - World evolves based on consistency and growth
- **Inspiration:** Stardew Valley, Mabinogi Mobile, LoL progression, Assassin's Creed growth arc

## Experience Principles

1. Must feel like a **game first**, self-improvement second
2. Never feel like a chore
3. Provide **freedom**, not rigid control
4. Reward **consistency**, not perfection
5. Create **emotional attachment** to the character

## Team Structure (3 Agent Teams)

### Team 1: Game Narrative
Designs the game world, story, lore, quests, dialogue, and branching progression.

| Agent | File | Role |
|-------|------|------|
| worldbuilder | `agents/worldbuilder.md` | World setting, factions, characters, rules |
| quest-designer | `agents/quest-designer.md` | Main/side quests tied to real-life actions |
| dialogue-writer | `agents/dialogue-writer.md` | NPC dialogue, player choices, cutscenes |
| branch-architect | `agents/branch-architect.md` | Branching structure, endings, flag system |
| narrative-reviewer | `agents/narrative-reviewer.md` | Cross-validation, plot holes, balance |

### Team 2: Visual Storytelling
Defines art direction, UI/UX, character design, and visual assets.

| Agent | File | Role |
|-------|------|------|
| story-architect | `agents/story-architect.md` | Narrative structure, scene composition |
| essay-writer | `agents/essay-writer.md` | Text parts, captions, emotional writing |
| image-prompter | `agents/image-prompter.md` | AI image prompts (pixel art / soft cartoon) |
| layout-builder | `agents/layout-builder.md` | HTML/CSS responsive layout |
| editorial-reviewer | `agents/editorial-reviewer.md` | Cross-validation across all visual assets |

### Team 3: Fullstack Webapp
Builds the actual web application.

| Agent | File | Role |
|-------|------|------|
| architect | `agents/architect.md` | System architecture, DB modeling, API design |
| frontend-dev | `agents/frontend-dev.md` | React/Next.js frontend |
| backend-dev | `agents/backend-dev.md` | API, DB, auth, business logic |
| qa-engineer | `agents/qa-engineer.md` | Test strategy, unit/integration/E2E |
| devops-engineer | `agents/devops-engineer.md` | CI/CD, deployment, monitoring |

## Skills (Orchestrators + Extensions)

| Skill | Type | Description |
|-------|------|-------------|
| `/life-game` | Orchestrator | Full pipeline orchestrator across all 3 teams |
| `/visual-storytelling` | Orchestrator | Visual team pipeline |
| `/fullstack-webapp` | Orchestrator | Webapp team pipeline |
| `/quest-design-patterns` | Extension | 12 quest archetypes, DRIP rewards, difficulty curves |
| `/dialogue-systems` | Extension | VOICE framework, choice psychology, bark system |
| `/branching-logic` | Extension | 6 branching patterns, flag systems, ending architecture |
| `/image-prompt-engineering` | Extension | 5-Layer prompts, style keywords, consistency techniques |
| `/narrative-structure-patterns` | Extension | 3-act/5-act/hero's journey, emotion curves |
| `/component-patterns` | Extension | React patterns, state management, folder structure |
| `/api-security-checklist` | Extension | OWASP Top 10, auth patterns, security headers |

## Art Direction

- **Style:** Pixel art or soft cartoon (cozy, warm, slightly nostalgic)
- **Avatar:** Resembles Jee Hyunwoo (180cm, slim build, Korean male)
- **AI Companion:** Distinct character design, friendly personality
- **UI/UX:** Clean but playful, slightly gamified dashboard, smooth animations
- **Everything must feel "visually rewarding"**

## Tech Stack (Webapp)

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Next.js API Routes or separate Express/Fastify
- **AI Integration:** OpenAI API (user already owns key) for:
  - AI companion dialogue
  - Personalized coaching
  - Daily reflection feedback
- **Domain:** milkfolio.space
- **GitHub:** hjee1 (new repository)
- **Deployment:** Vercel or similar

## Workspace Convention

All design/planning documents go to `_workspace/`:
- `00_input.md` — User input summary
- `01_worldbuilding.md` — World setting
- `02_quest_design.md` — Quest design
- `03_dialogue_script.md` — Dialogue script
- `04_branch_map.md` — Branching map
- `05_review_report.md` — Review report
- Visual assets in `_workspace/images/`
- Source code in `src/`

## Language

- Respond in **Korean**, use English for technical terms
- Keep responses concise and direct
- Commit and push to GitHub after every meaningful change
