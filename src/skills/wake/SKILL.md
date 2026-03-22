---
name: wake
description: Spawn Oracle in new tmux tab with instruction. Use when user says "wake", "spawn", "start oracle", "new oracle tab", or wants to launch another Oracle instance for parallel work. Do NOT trigger for messaging existing Oracle (use /talk-to or /tell), creating worktrees for self (use /worktree), or transferring work (use /handover).
argument-hint: "<oracle-name> [worktree] <instruction>"
---

# /wake — Spawn Oracle in New Tmux Tab

Launch another Oracle in a new tmux window with instruction.

## Usage

```
/wake neo "fix awaken bugs #109 #110"
/wake neo oracle-skills-cli "implement /deep-analysis"
/wake hermes "check LINE messages"
```

## Steps

### 1. Parse

- `$ARGUMENTS[0]` = oracle name
- If second arg looks like a repo/worktree name (no spaces) = worktree
- Rest = instruction (quoted)

### 2. Wake

```bash
# With worktree
maw wake <oracle-name> <worktree>

# Without worktree (default)
maw wake <oracle-name>
```

### 3. Send Instruction

Wait 3 seconds for Oracle to start, then:

```bash
maw hey <oracle-name> "<instruction>"
```

### 4. Output

```
Woke <oracle-name> in tmux
→ Sent: "<instruction>"
```

## Rules

- Always wait briefly before sending instruction (Oracle needs startup time)
- If maw wake fails, show error — don't send instruction
- Keep instruction as-is

ARGUMENTS: $ARGUMENTS
