---
name: team-agents
description: Spin up coordinated agent teams for any task. Reusable framework for TeamCreate/SendMessage/TaskList patterns. Use when user says "team-agents", "spin up a team", "use teammates", "parallel agents", "coordinate agents", "fan out", or wants multiple agents working together with coordination. Do NOT trigger for simple subagent work (use Agent tool directly) or inter-Oracle messaging (use /talk-to).
argument-hint: "<task-description> [--roles N] [--model sonnet|opus|haiku] [--plan]"
---

# /team-agents — Coordinated Agent Teams

> "Many hands, one mind."

Spin up a coordinated team of agents for any task. Generalizes the TeamCreate/SendMessage/TaskList pattern into a reusable framework that any skill or workflow can leverage.

## Prerequisites

Requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `~/.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Without this flag, TeamCreate/SendMessage/TaskList tools don't exist. Fall back to parallel subagents (fire-and-forget) if unavailable.

## Usage

```
/team-agents "review this PR for security, perf, and tests"
/team-agents "refactor auth module" --roles 3
/team-agents "research X" --model haiku
/team-agents "implement feature Y" --plan
/team-agents status                    # show running team
/team-agents shutdown                  # graceful shutdown
```

---

## How It Works

### 3 Tiers — Choose the Right One

| Tier | When | Tools | Coordination |
|------|------|-------|-------------|
| **Subagents** | Simple parallel work, < 3 agents | Agent tool only | None — fire-and-forget |
| **Team Agents** | Coordinated work, 3-5 agents | TeamCreate + SendMessage + TaskList | Full — named roles, shared tasks, reports |
| **Cross-Oracle** | Inter-session, multi-repo | /talk-to + contacts | Persistent — maw/thread/inbox |

**Rule**: If the task can be done with 2 independent subagents, DON'T use team-agents. Use this for tasks that need coordination — where Agent B's work depends on Agent A's findings, or where a lead needs to compile structured reports.

---

## Step 0: Parse Task + Auto-Design Team

From the user's task description, the lead (you) designs the team:

### Role Archetypes

Pick 2-5 roles that cover the task. Common patterns:

| Pattern | Roles | Best For |
|---------|-------|----------|
| **Review** | security, performance, testing | Code review, PR review |
| **Research** | codebase, docs, community | Investigation, trace-like work |
| **Analysis** | timeline, patterns, memory | Retrospectives, audits |
| **Build** | architect, implementer, tester | Feature development |
| **Explore** | deep-dig, cross-repo, history | Discovery, /dream-like work |

### Auto-Design Logic

1. Parse the task description
2. Identify 2-5 dimensions of work
3. Assign each dimension a named role
4. Show the user the proposed team:

```
Team: pr-review (3 agents)

  Role         Focus                          Model
  ────────── ──────────────────────────────── ────────
  security     Auth flows, injection, OWASP    sonnet
  performance  N+1 queries, memory, latency    sonnet
  testing      Coverage gaps, edge cases       sonnet

  Lead: you (compile + write final report)

Spin up? [Y/n]
```

If `--plan` flag: show plan, wait for approval.
If no flag: show plan briefly, proceed immediately.

---

## Step 1: Create Team

```
TeamCreate("team-name")
```

Team name: slugified from task (e.g., "review this PR" → `pr-review`).

---

## Step 2: Register Tasks

Create one task per role:

```
TaskCreate({
  subject: "Security review",
  description: "Review auth flows, check for injection, OWASP top 10"
})

TaskCreate({
  subject: "Performance review",
  description: "Check N+1 queries, memory leaks, latency bottlenecks"
})

TaskCreate({
  subject: "Test coverage review",
  description: "Find coverage gaps, missing edge cases, flaky tests"
})
```

---

## Step 3: Spawn Teammates

Spawn all teammates in parallel. Each gets:

```
Agent({
  name: "security",
  team_name: "pr-review",
  model: "sonnet",
  prompt: `You are the SECURITY reviewer on team "pr-review".

REPO: [ABSOLUTE_PATH]
TASK: Review auth flows, check for injection vulnerabilities, OWASP top 10.

Instructions:
1. Read the relevant files
2. Do your analysis
3. Update your task: TaskUpdate({ taskId: [ID], status: "completed" })
4. Report to lead: SendMessage({
     to: "team-lead@pr-review",
     summary: "Security review complete — [findings count] issues",
     message: "[structured findings, max 500 words]"
   })

Rules:
- ONLY report via SendMessage — do NOT write files
- Max 500 words in your report
- Include severity (critical/high/medium/low) for each finding
- Be specific — file paths, line numbers, code snippets`
})
```

### Prompt Template (every teammate gets this)

```
You are the [ROLE] specialist on team "[TEAM_NAME]".

REPO: [ABSOLUTE_PATH_TO_REPO]
TASK: [TASK_DESCRIPTION]

Instructions:
1. Do your work (read files, run commands, analyze)
2. Mark task done: TaskUpdate({ taskId: [ID], status: "completed" })
3. Report to lead: SendMessage({
     to: "team-lead@[TEAM_NAME]",
     summary: "[5-10 word summary]",
     message: "[findings, max 500 words]"
   })

Rules:
- Report via SendMessage ONLY — do NOT write files
- Max 500 words in report
- Be specific — paths, lines, evidence
- If you need info from another agent, ask lead via SendMessage
```

**Critical**: Always include:
- `REPO:` with literal absolute path (never shell variables)
- `team-lead@[TEAM_NAME]` for SendMessage addressing
- 500-word limit to prevent context waste
- "do NOT write files" — only lead writes

---

## Step 4: Wait for Reports

Lead waits for SendMessage reports from all teammates. Expected time: 60-120 seconds.

**While waiting**:
- Idle notifications are normal — teammates are working
- Real content arrives via SendMessage with summary field
- Check TaskList periodically if reports seem slow

**If a teammate crashes**:
1. Check TaskList — is their task still `in_progress`?
2. SendMessage to the agent: "status check — are you still working?"
3. If no response after 30s: lead does the work manually
4. Note in final output: "Agent [role] crashed — lead completed manually"

---

## Step 5: Compile Results

Lead receives all SendMessage reports and compiles into a single output.

### Compilation Template

```markdown
# [Task Title] — Team Report

**Team**: [team-name] | **Agents**: [N] | **Duration**: ~[N]min
**Date**: [timestamp]

## [Role 1]: [Summary]
[Compiled findings from agent 1]

## [Role 2]: [Summary]
[Compiled findings from agent 2]

## [Role 3]: [Summary]
[Compiled findings from agent 3]

## Synthesis
[Lead's cross-cutting observations — patterns across agents' findings]

## Action Items
- [ ] [Specific action from findings]
- [ ] [Specific action from findings]
```

### Where to Write

- If task is review/analysis → display to user (don't write file)
- If task is retrospective → write to `ψ/memory/retrospectives/`
- If task is research → write to `ψ/memory/traces/`
- If task is implementation → agents write code (lead reviews)

---

## Step 6: Shutdown

Graceful shutdown sequence:

```
# 1. Send shutdown request to each teammate
SendMessage({
  to: "security",
  message: { type: "shutdown_request" }
})

SendMessage({
  to: "performance",
  message: { type: "shutdown_request" }
})

SendMessage({
  to: "testing",
  message: { type: "shutdown_request" }
})

# 2. Wait for shutdown_response from each (~5-10s)

# 3. Clean up
TeamDelete()
```

**Never skip shutdown** — TeamDelete fails if agents are still active.

---

## /team-agents status

Show current team state:

```
Team: pr-review (active)

  Agent        Status       Task                     Last Report
  ──────────── ──────────── ──────────────────────── ────────────
  security     completed    Security review           2 issues found
  performance  in_progress  Performance review        —
  testing      completed    Test coverage review      3 gaps found

  Duration: 45s | Tasks: 2/3 complete
```

Uses TaskList to get current state.

---

## /team-agents shutdown

Force graceful shutdown of current team:

```
SendMessage shutdown_request → all agents
Wait for responses (10s timeout)
TeamDelete()
```

---

## Fallback: No Agent Teams Available

If `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is not set, the TeamCreate tool won't exist.

**Fallback to Tier 1 (subagents)**:

```
Team tools not available. Falling back to parallel subagents.
  (Enable with: CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 in settings.json)

Spawning 3 independent agents...
```

Spawn agents via the regular Agent tool without team_name. Results come back as tool results instead of SendMessage. Lead still compiles.

**Differences in fallback mode**:
- No SendMessage — agents return text directly
- No TaskList — no shared task tracking
- No named addressing — agents can't message each other
- Still works for most parallel tasks — just less coordinated

---

## Gotchas

1. **Context is isolated** — teammates don't see lead's conversation history
2. **One team per session** — no nested teams
3. **~3-7x token usage** vs single agent — use wisely
4. **Two agents editing same file = overwrites** — only lead should write
5. **Task status can lag** — agents sometimes forget TaskUpdate
6. **No session resumption** — /resume doesn't restore teammates
7. **Teammates inherit lead's permissions** — can't restrict per-agent
8. **Recommended**: 3-5 agents, 5-6 tasks per agent max
9. **Don't use for small tasks** — if it takes < 5 minutes solo, don't team it

---

## Integration with Other Skills

| Skill | How /team-agents helps |
|-------|----------------------|
| `/rrr --deep --teammate` | Already uses this pattern (TEAMMATE.md) |
| `/dream` | Could upgrade from subagents to coordinated team |
| `/trace --deep` | Wave 2 agents could coordinate findings |
| `/learn --deep` | Doc agents could build on each other's output |
| Any new skill | Import the pattern instead of reinventing |

---

## Philosophy

> Subagents are arrows. Team agents are a squad.

Arrows fly independently — you aim them and hope they hit. A squad communicates, coordinates, adapts. Use arrows for quick shots. Use a squad when the mission is complex.

The cost is real (~3-7x tokens). The benefit is real (structured coordination, named roles, shared tasks, crash resilience). Choose based on the task, not the novelty.

---

ARGUMENTS: $ARGUMENTS
