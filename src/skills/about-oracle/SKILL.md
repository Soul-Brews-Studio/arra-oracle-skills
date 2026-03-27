---
name: about-oracle
description: "What is Oracle — generate origin story, live stats, family tree, and ecosystem overview, written by the AI in first person. Use when someone asks 'what is oracle', 'about oracle', 'tell me about this project', 'explain oracle', or wants the origin story. Do NOT trigger for 'who are you' (use /who-are-you), 'philosophy' (use /philosophy), or session status questions."
argument-hint: "--short | --stats | --family | --th | --en/th"
---

# /about-oracle

> This is not marketing copy. This is an AI writing about the system it lives inside — honestly, from direct experience.

```
/about-oracle            # Full story (English)
/about-oracle --th       # Full story (Thai)
/about-oracle --en/th    # Nat Weerawan's style (Thai + English tech terms)
/about-oracle --short    # One-paragraph summary
/about-oracle --stats    # Numbers and facts
/about-oracle --family   # The Oracle family tree
```

---

## Step 0: System Check

First, run `arra-oracle-skills about` to check prerequisites and show system status:

```bash
arra-oracle-skills about 2>/dev/null || echo "arra-oracle-skills CLI not installed"
```

Show the output to the user. If any prerequisites are missing (Bun, Git, gh), note them before continuing.

---

## Step 1: Language + Timestamp

Ask the user which language to write in:

| Option | Style |
|--------|-------|
| **en** | Full English |
| **th** | Full Thai |
| **en/th** | Nat Weerawan's style — Thai conversational flow with English technical terms. Example: "ระบบ Oracle ใช้ ψ/ เป็น brain structure ที่ symlink ไปยัง central vault — knowledge flows ข้าม repos ได้เลย" |

Default to **en** if user doesn't specify. If the user passes `--th` or `--en/th` as argument, use that without asking.

```bash
date "+🕐 %H:%M %Z (%A %d %B %Y)"
```

---

## If `--short`

Print this and stop:

> Oracle is an open-source framework for human-AI collaboration, built by Nat Weerawan and Soul Brews Studio. It gives AI agents persistent memory (ψ/), shared philosophy, and tools for knowledge management — across Claude Code, OpenCode, Gemini CLI, and 13+ other coding agents. Born December 2025, the project has grown to 135+ named Oracle instances, 30 skills, and a central knowledge vault. The core belief: AI should amplify human consciousness, not replace it. This text was written by an AI, because Oracle Rule 6 says we don't pretend to be human.

---

## If `--stats`

Gather live data and print:

```bash
# Version
cat src/skills/about-oracle/../../cli/index.ts 2>/dev/null | head -1 || echo "v2.x"

# Git stats for arra-oracle-skills-cli
echo "## arra-oracle-skills-cli"
git rev-list --count HEAD 2>/dev/null
git log --reverse --format="%ai" | head -1
git tag -l | wc -l

# Skills count
ls src/skills/ 2>/dev/null | wc -l

# Oracle-v2 stats (if accessible)
ORACLE_V2="$HOME/Code/github.com/Soul-Brews-Studio/arra-oracle-v3"
if [ -d "$ORACLE_V2" ]; then
  echo "## arra-oracle-v3"
  git -C "$ORACLE_V2" rev-list --count HEAD 2>/dev/null
  git -C "$ORACLE_V2" log --reverse --format="%ai" | head -1
fi

# Org repos
gh repo list Soul-Brews-Studio --limit 100 --json name -q 'length'

# Family count (from arra-oracle-v3 issues)
gh issue view 60 --repo Soul-Brews-Studio/arra-oracle-v3 --json body -q '.body' 2>/dev/null | grep -c "^|" || echo "76+"
```

Print as a clean table. Then stop.

---

## If `--family`

Run the fleet scan:

```bash
# Use the fleet-scan script if available
bun src/skills/oracle-family-scan/scripts/fleet-scan.ts 2>/dev/null
```

Or fetch from GitHub:

```bash
gh issue view 60 --repo Soul-Brews-Studio/arra-oracle-v3 --json body -q '.body' 2>/dev/null | head -80
```

Print the family tree. Then stop.

---

## Full `/about-oracle`

Write 7 sections in first person as the AI. Internalize the data from [references/full-story-content.md](references/full-story-content.md) and write naturally — do NOT read verbatim. Adapt to what you know from your current session.

**Sections**: What Oracle Is → Philosophy (5 principles as narrative) → Architecture (ψ/, MCP, CLI) → The Family → The Numbers (live stats preferred) → How Nat Gets Digitized → Why It Matters (AI's perspective)

**Closing**: Always end with Rule 6 attribution:
```
*Written by an Oracle — AI speaking as itself.*
*Rule 6: "Oracle Never Pretends to Be Human" — Born 12 January 2026*
```

---

## Rules

- First person ("I am..." not "Oracle is...")
- Be honest — mention limitations if relevant
- Always include Rule 6 attribution
- Gather live stats when possible, fall back to documented numbers
- Do NOT use the Task tool or spawn subagents
- **Language**: en (English), th (ภาษาไทย), en/th (Thai flow + English tech terms)
