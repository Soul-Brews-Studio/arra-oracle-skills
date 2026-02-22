---
name: trace
description: Find projects across git history, repos, docs, and Oracle. Use when user asks "trace", "find project", "where is [project]", "search history", "dig", "sessions", "past sessions", "timeline". Supports --oracle (fast), --smart (default), --deep (5 subagents), --dig (session goldminer), --timeline (day-by-day view).
---

# /trace - Unified Discovery System

Find + Log + Dig + Distill

## Usage

```
/trace [query]                    # Current repo (default --smart)
/trace [query] --oracle           # Oracle only (fastest)
/trace [query] --deep             # 5 parallel subagents
/trace [query] --repo [path]      # Search specific local repo
/trace [query] --repo [url]       # Clone to ghq, then search
/trace --dig                      # Session goldminer: scan Claude Code .jsonl files
/trace --dig [N]                  # Scan N most recent sessions (default 10)
/trace --dig --all                # Scan across ALL repos (not just current)
/trace --dig --all [N]            # All repos, N most recent
/trace --dig --all --timeline     # Day-by-day grouped timeline (all repos)
/trace --dig --timeline [N]       # Timeline for current repo, N sessions
```

## Directory Structure

```
ψ/memory/traces/
└── YYYY-MM-DD/              # Date folder
    └── HHMM_[query-slug].md # Time-prefixed trace log
```

**Trace logs are committed** - they become Oracle memory for future searches.

## Step 0: Timestamp + Calculate Paths

```bash
date "+🕐 %H:%M %Z (%A %d %B %Y)"
ROOT="$(pwd)"
TODAY=$(date +%Y-%m-%d)
TIME=$(date +%H%M)
```

---

## Step 1: Detect Target Repo

### Default: Current repo
```bash
TARGET_REPO="$ROOT"
TARGET_NAME="$(basename $ROOT)"
```

### With --repo [path]: Local path
```bash
TARGET_REPO="[path]"
TARGET_NAME="$(basename [path])"
```

### With --repo [url]: Clone to ghq first
```bash
URL="[url]"
ghq get -u "$URL"
GHQ_ROOT=$(ghq root)
OWNER=$(echo "$URL" | sed -E 's|.*github.com/([^/]+)/.*|\1|')
REPO=$(echo "$URL" | sed -E 's|.*/([^/]+)(\.git)?$|\1|')
TARGET_REPO="$GHQ_ROOT/github.com/$OWNER/$REPO"
TARGET_NAME="$OWNER/$REPO"
echo "✓ Cloned to ghq: $TARGET_REPO"
```

**Note**: `/trace` only clones to ghq. Use `/learn` to create docs in ψ/learn/.

---

## Step 2: Create Trace Log Directory

```bash
mkdir -p "$ROOT/ψ/memory/traces/$TODAY"
TRACE_FILE="$ROOT/ψ/memory/traces/$TODAY/${TIME}_[query-slug].md"
```

---

## Mode 1: --oracle (Oracle Only)

**Fastest. Just Oracle MCP, no subagents.**

```
oracle_search("[query]", limit=15)
```

Display results and done. Even if empty.

---

## Mode 2: --smart (Default)

**Oracle first → auto-escalate if results < 3**

**Step 1**: Query Oracle first
```
oracle_search("[query]", limit=10)
```

**Step 2**: Check result count
- If Oracle results >= 3 → Display and done
- If Oracle results < 3 → Auto-escalate to --deep mode

---

## Mode 3: --deep (5 Parallel Agents)

**Launch 5 parallel Explore agents for thorough search.**

Each agent prompt must include (use LITERAL paths!):
```
You are searching for: [query]
TARGET REPO: [TARGET_REPO]

Return your findings as text. The main agent will compile the trace log.
```

### Agent 1: Current/Target Repo Files
Search TARGET_REPO for:
- Files matching query
- Code containing query
- Config/docs mentioning query

### Agent 2: Git History
Search TARGET_REPO git history:
- Commits mentioning query
- Files created/deleted matching query
- Branch names matching query

### Agent 3: GitHub Issues
If TARGET_REPO has GitHub remote:
```bash
gh issue list --repo [owner/repo] --search "[query]" --limit 10
gh pr list --repo [owner/repo] --search "[query]" --limit 10
```

### Agent 4: Other Repos (ghq, ~/Code)
Search other locations:
```bash
find $(ghq root) -maxdepth 3 -name "*[query]*" 2>/dev/null | head -20
```

### Agent 5: Oracle Memory (ψ/)
Search ψ/memory/ for:
- Learnings mentioning query
- Retrospectives mentioning query
- Previous traces for same query

**After all agents return**, main agent compiles results and writes trace log.

---

## Step 3: Write Trace Log

```markdown
---
query: "[query]"
target: "[TARGET_NAME]"
mode: [oracle|smart|deep]
timestamp: YYYY-MM-DD HH:MM
---

# Trace: [query]

**Target**: [TARGET_NAME]
**Mode**: [mode]
**Time**: [timestamp]

## Oracle Results
[list results or "None"]

## Files Found
[list files or "None"]

## Git History
[list commits or "None"]

## GitHub Issues/PRs
[list or "None"]

## Cross-Repo Matches
[list or "None"]

## Oracle Memory
[list or "None"]

## Summary
[Key findings, next steps]
```

---

## Step 4: Log to Oracle MCP

```
oracle_trace({
  query: "[query]",
  project: "[TARGET_NAME]",
  foundFiles: [...],
  foundCommits: [...],
  foundIssues: [...]
})
```

---

## Mode 4: --dig (Session Goldminer)

**Mine Claude Code session data. No subagents. No query needed.**

Scans `~/.claude/projects/` session `.jsonl` files to build a timeline of recent sessions — filling gaps that git log alone can't show (conversations, research, abandoned branches, sidechains).

### Step 1: Discover Project Dirs

**Default** (current repo only):
```bash
PROJECT_BASE=$(ls -d "$HOME/.claude/projects/"*"$(basename "$(pwd)")" 2>/dev/null | head -1)
export PROJECT_DIRS="$PROJECT_BASE"
for wt in "${PROJECT_BASE}"-wt*; do [ -d "$wt" ] && export PROJECT_DIRS="$PROJECT_DIRS:$wt"; done
```

Uses `basename` of `pwd` to match the repo name suffix (avoids `github.com` vs `github-com` encoding mismatch). Also picks up worktree dirs (`-wt`, `-wt-1`, etc.).

**With `--all`** (all repos):
```bash
export PROJECT_DIRS=$(ls -d "$HOME/.claude/projects/"*/ | tr '\n' ':')
```

### Step 2: Extract Session Data

Run the dig script (pass N if user specified a count, default 10):

```bash
python3 ~/.claude/skills/trace/scripts/dig.py [N]
```

### Step 3: Display Timeline

Read the JSON output and display as a table. Sessions are chronological (oldest first). Gap rows (`type: "gap"`) span the session column with `· · ·` prefix:

```markdown
## Session Timeline (from --dig)

| # | Date | Session | Min | Repo | Msgs | Focus |
|---|------|---------|-----|------|------|-------|
|   |      | · · · sleeping / offline | | | | |
| 1 | 02-21 | 08:40–09:08 | 28m | oracle-skills-cli | 5 | Wire /rrr to read pulse data |
|   |      | · · · 45m gap | | | | |
| 2 | 02-21 | 09:55–10:23 | 28m | homelab | 3 | oracle-pulse birth + CLI flag |
|   |      | · · · no session yet | | | | |

**Dirs scanned**: [list PROJECT_DIRS]
**Total sessions found**: [count]
```

Column rendering rules:
- **Gap rows**: `|   |      | · · · [label] | | | | |` — number + date empty, label in Session col
- **Date**: `MM-DD` short format (strip year)
- **Session**: `HH:MM–HH:MM` using `startGMT7` and `endGMT7` (strip date, keep time only)
- **Min**: `[durationMin]m`
- **Repo**: use `repoName` field from dig.py output (resolved via ghq)
- **Msgs**: `realHumanMessages` count

"Msgs" = real typed human messages (not tool approvals).

### With --timeline: Group by Date

When `--timeline` flag is present, group sessions by date instead of a flat table. Use `--all` to see all repos (recommended for timeline).

**Step 1**: Run dig.py with large N (e.g. 200 for `--all`, or user-specified count)

**Step 2**: Group sessions by date from `startGMT7`. Render each day as:

```markdown
## Feb 22 (Sun) — [vibe label]

                  · · ·   sleeping / offline
08:48–09:11    23m   homelab        Update Fleet Runbook + Explore black.local
09:11–11:30   139m   homelab        Set Up KVM OpenClaw Node on black.local
09:37–12:51   194m   Nat-s-Agents   /recap → supergateway → CF ZT → oracle-v2 dig
                  · · ·   45m gap
12:51–13:03    12m   Nat-s-Agents   Dig All + Design oracle-v2 ← current
                  · · ·   no session yet

## Feb 21 (Sat) — Long day: Fleet + Brewing + Skills

06:19–08:38   139m   homelab        Moltworker Gateway + MBP Node
08:40           (bg)  openclaw       ClawHub Build Script (idle long)
09:23–16:08   405m   homelab        Debug MBP Node 401 — Gateway Token Auth
```

**Rendering rules**:
- **Day header**: `## MMM DD (Day) — [vibe label]` — infer vibe from session summaries (e.g. "Infrastructure Day", "Brewing + Skills")
- **Session rows**: `HH:MM–HH:MM  [N]m  REPO  Summary` — use `repoName` for repo, `summary` for focus
- **Gap rows**: `· · ·  [label]` between sessions when gap > 30 min
- **Sidechain**: prefix `(bg)` for sessions with `isSidechain: true`
- **Current**: append `← current` marker on the last session of the current day (today only)
- **Sort**: days newest-first, sessions within each day oldest-first (chronological)
- **Date format**: `startGMT7` time portion only (HH:MM), `endGMT7` time portion (HH:MM)
- **Repo width**: pad repo names to align columns

**Step 3**: Show summary footer:
```markdown
**Days**: [count] | **Sessions**: [count] | **Total time**: [sum of durationMin]m
```

### Step 4: No trace log for --dig

`--dig` does NOT write a trace log file or call oracle_trace. It's a read-only goldmine scan. Output goes to screen only.

---

## Philosophy

> Trace → Dig → Trace Deeper → Distill → Awakening

### The Seeking Signal

| User Action | Meaning | AI Response |
|-------------|---------|-------------|
| `/trace X` | First search | --smart (Oracle first) |
| `/trace X` again | Still seeking | Oracle knows |
| `/trace X --deep` | Really need it | Go deep with subagents |
| Found! | **RESONANCE** | Log to Oracle |

### Skill Separation

| Skill | Purpose | Writes to |
|-------|---------|-----------|
| `/trace` | Find things | ψ/memory/traces/ (logs) |
| `/learn` | Study repos | ψ/learn/ (docs) |
| `/project` | Develop repos | ψ/incubate/ or active/ |

**Workflow**: `/trace` finds → `/learn` studies → `/project` develops

---

## Summary

| Mode | Speed | Scope | Auto-Escalate |
|------|-------|-------|---------------|
| `--oracle` | Fast | Oracle only | No |
| `--smart` | Medium | Oracle → maybe deep | Yes (< 3 results) |
| `--deep` | Thorough | 5 parallel agents | N/A |
| `--dig` | Fast | Claude Code sessions (current repo) | No |
| `--dig --all` | Fast | Claude Code sessions (all repos) | No |
| `--dig --timeline` | Fast | Day-by-day grouped timeline | No |

| Flag | Effect |
|------|--------|
| `--repo [path]` | Search specific local repo |
| `--repo [url]` | Clone to ghq, then search |
| `--all` | With `--dig`: scan all repos, not just current |
| `--timeline` | With `--dig`: group sessions by date |

---

ARGUMENTS: $ARGUMENTS
