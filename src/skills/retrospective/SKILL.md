---
name: retrospective
description: Quick session retrospective — summary, lessons, next steps. Use when user says "retrospective", "retro", "session summary", "wrap up session". Do NOT trigger for full /rrr (install arra-symbiosis-skills), session orientation (use /recap), or handoff (use /forward).
argument-hint: "[--detail]"
---

# /retrospective — Session Retrospective

Quick retrospective for any Oracle. For the full /rrr experience, install arra-symbiosis-skills.

## Steps

### 1. Gather

```bash
date "+%H:%M %Z (%A %d %B %Y)"
git log --oneline -10
```

### 2. Write

Path: `ψ/memory/retrospectives/YYYY-MM/DD/HH.MM_slug.md`

```bash
PSI=$(readlink -f ψ 2>/dev/null || echo "ψ")
mkdir -p "$PSI/memory/retrospectives/$(date +%Y-%m/%d)"
```

Include:
- Session Summary
- What Got Done (commits, PRs)
- Lessons Learned
- Next Steps

### 3. Sync to Oracle

```
arra_learn({ pattern: [lesson], concepts: [tags], source: "retrospective: REPO" })
```

Do NOT git add ψ/ — vault is shared state.

ARGUMENTS: $ARGUMENTS
