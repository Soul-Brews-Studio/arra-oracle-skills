---
name: rrr
description: Create session retrospective with AI diary and lessons learned. Use when user says "rrr", "retrospective", "wrap up session", "session summary", or at end of work session.
argument-hint: "[--detail | --dig | --deep]"
---

# /rrr

> "Reflect to grow, document to remember."

```
/rrr              # Quick retro, main agent
/rrr --detail     # Full template, main agent
/rrr --dig        # Reconstruct past timeline from session .jsonl
/rrr --deep       # 5 parallel agents (read DEEP.md)
```

**NEVER spawn subagents or use the Task tool. Only `--deep` may use subagents.**
**`/rrr`, `/rrr --detail`, and `/rrr --dig` = main agent only. Zero subagents. Zero Task calls.**

---

## /rrr (Default)

### 1. Gather

```bash
date "+%H:%M %Z (%A %d %B %Y)"
git log --oneline -10 && git diff --stat HEAD~5
```

### 1.5. Read Pulse Context (optional)

```bash
cat ψ/data/pulse/project.json 2>/dev/null
cat ψ/data/pulse/heartbeat.json 2>/dev/null
```

If files don't exist, skip silently. Never fail because pulse data is missing.
Pulse data may not exist yet — the `2>/dev/null` handles this.

If found, extract:
- From `project.json`: `totalSessions`, `avgMessagesPerSession`, `sizes` (to categorize current session), `branches` (activity on current branch)
- From `heartbeat.json`: `streak.days` (momentum), `weekChange` (acceleration/slowdown), `today` (today's activity so far)

### 2. Write Retrospective

**Path**: `ψ/memory/retrospectives/YYYY-MM/DD/HH.MM_slug.md`

```bash
mkdir -p "ψ/memory/retrospectives/$(date +%Y-%m/%d)"
```

Write immediately, no prompts. If pulse data was found, weave it into the narrative (don't add a separate dashboard). Include:
- Session Summary — if pulse data exists, add one line: "Session #X of Y in this project (Z-day streak)"
- Timeline
- Files Modified
- AI Diary (150+ words, first-person) — if pulse data exists, reference momentum naturally: "in a week with +X% messaging velocity" or "on day N of an unbroken streak"
- Honest Feedback (100+ words, 3 friction points)
- Lessons Learned
- Next Steps

### 3. Write Lesson Learned

**Path**: `ψ/memory/learnings/YYYY-MM-DD_slug.md`

### 4. Oracle Sync

```
oracle_learn({ pattern: [lesson content], concepts: [tags], source: "rrr: REPO" })
```

### 5. Save

Retro files are written to vault (wherever `ψ` symlink resolves).

**Do NOT `git add ψ/`** — it's a symlink to the vault. Vault files are shared state, not committed to repos.

---

## /rrr --detail

Same flow as default but use full template:

```markdown
# Session Retrospective

**Session Date**: YYYY-MM-DD
**Start/End**: HH:MM - HH:MM GMT+7
**Duration**: ~X min
**Focus**: [description]
**Type**: [Feature | Bug Fix | Research | Refactoring]

## Session Summary
(If pulse data exists, add: "Session #X of Y in this project (Z-day streak)")
## Timeline
## Files Modified
## Key Code Changes
## Architecture Decisions
## AI Diary (150+ words, vulnerable, first-person)
(If pulse data exists, reference momentum: velocity changes, streak length)
## What Went Well
## What Could Improve
## Blockers & Resolutions
## Honest Feedback (100+ words, 3 friction points)
## Lessons Learned
## Next Steps
## Metrics (commits, files, lines)
### Pulse Context (if pulse data exists)
Project: X sessions | Avg: Y msgs/session | This session: Z msgs (category)
Streak: N days | Week trend: ±X% msgs | Branch: main (N sessions)
```

Then steps 3-5 same as default.

---

## /rrr --dig

**Retrospective powered by session goldminer. No subagents.**

### 1. Run dig to get session timeline

Discover project dirs using basename matching (handles dots in paths like `github.com`), including worktree dirs:

```bash
PROJECT_BASE=$(ls -d "$HOME/.claude/projects/"*"$(basename "$(pwd)")" 2>/dev/null | head -1)
export PROJECT_DIRS="$PROJECT_BASE"
for wt in "${PROJECT_BASE}"-wt*; do [ -d "$wt" ] && export PROJECT_DIRS="$PROJECT_DIRS:$wt"; done
```

Then run dig.py to get session JSON:

```bash
python3 ~/.claude/skills/dig/scripts/dig.py 0
```

Also gather git context:

```bash
date "+%H:%M %Z (%A %d %B %Y)"
git log --oneline -10 && git diff --stat HEAD~5
```

### 2. Write Retrospective with Timeline

Use the session timeline data to write a full retrospective using the `--detail` template. Add the Past Session Timeline table after Session Summary, before Timeline.

Also run pulse context (step 1.5 from default mode) and weave into narrative.

### 3-5. Same as default steps 3-5

Write lesson learned, oracle sync.

**Do NOT `git add ψ/`** — vault files are shared state, not committed to repos.

---

## /rrr --deep

Read `DEEP.md` in this skill directory. Only mode that uses subagents.

---

## Wizard v2 Context

If the Oracle was born via `/awaken` wizard v2, CLAUDE.md may contain:
- **Memory consent**: If `auto`, `/rrr` runs are expected and welcomed. If `manual`, only run when explicitly asked.
- **Experience level**: Adjust diary depth (beginner = simpler language, senior = technical depth)
- **Team context**: If multi-Oracle team, note cross-Oracle learnings and handoff relevance

Check CLAUDE.md for these fields. If not present, use defaults (auto memory, standard depth).

---

## Rules

- **NO SUBAGENTS**: Never use Task tool or spawn subagents (only `--deep` may)
- AI Diary: 150+ words, vulnerability, first-person
- Honest Feedback: 100+ words, 3 friction points
- Oracle Sync: REQUIRED after every lesson learned
- Time Zone: GMT+7 (Bangkok)
