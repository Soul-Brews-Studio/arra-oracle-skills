---
name: workon
description: Work on an issue OR resume a killed worktree. Use when user says "workon", "work on", "implement issue", "resume", "bring back", "restore worktree".
---

# /workon — Work + Resume

Start work from issue OR resume killed worktree.

## Usage

```
/workon #435                              # Work on issue (this repo)
/workon #435 --oracle neo                 # Assign to specific Oracle
/workon Soul-Brews-Studio/arra-oracle#435 # Cross-repo issue
/workon --resume athena                   # Resume killed worktree + old session
/workon --resume thor                     # Resume Thor with old context
```

## Flow

### Step 1: Read Issue

```bash
gh issue view [N] --repo [owner/repo] --json title,body,labels,assignees
```

Extract: title, body, repo, labels, context.

### Step 2: Spawn Worktree

```bash
maw wake [current-oracle] [task-name]
```

Task name = slugified issue title (e.g., `awaken-wizard-v2`).

### Step 3: Create Tracking Issue (if cross-repo)

If working on a different repo than the issue source:

```bash
gh issue create --repo [target-repo] --title "[task]" --body "From [source-repo]#[N]"
```

Pulse tracks work via issues — no issue = Pulse doesn't see.

### Step 4: Send Task (MCP first → hey after)

Post to oracle_thread:
```
oracle_thread({ title: "channel:[worktree-name]", message: "instructions + issue link" })
```

Then notify:
```bash
maw hey [worktree-name] "💬 channel:[name] (#[thread-id])
From: [parent Oracle]
งาน: [issue title]
→ /talk-to #[thread-id]"
```

Instructions include:
- Issue link (gh issue view)
- /project incubate [repo] (if cross-repo)
- What to do
- "เสร็จแล้ว maw hey [parent] + maw hey [reviewer]"

### Step 5: Confirm

```
⚡ /workon #435

  Issue:     /awaken Wizard v2
  Worktree:  mother-awaken-wizard-v2
  Thread:    #[N]
  Task sent: MCP + hey

  Worktree is working. Will report back via maw talk-to.
```

### Step 6: When Worktree Reports Back

Worktree follows this pattern when done:
1. `oracle_thread()` → MCP reply with summary + PR link
2. `maw hey [parent]-oracle` → notify parent
3. `maw hey [reviewer]-oracle` → notify reviewer

Parent reviews → approves → `maw done [worktree]` to cleanup.

---

## Mode 2: `--resume` — Restore Killed Worktree

### Step 1: Find Old Session

Search `~/.claude/projects/` (NOT maw ls — worktree gone after done/sleep):

```bash
for dir in ~/.claude/projects/*[name]*/; do
  echo "=== $(basename $dir) ==="
  ls -lS "$dir"*.jsonl 2>/dev/null
done
```

Pick **largest .jsonl** = most context = real session.

### Step 2: Wake Worktree

```bash
maw wake mother [name]
```

### Step 3: Copy Session to New Path

```bash
OLD_DIR="~/.claude/projects/...-wt-[OLD]-[name]"
NEW_DIR="~/.claude/projects/...-wt-[NEW]-[name]"
mkdir -p "$NEW_DIR"
cp -r "$OLD_DIR/[session-id]" "$NEW_DIR/"
cp "$OLD_DIR/[session-id].jsonl" "$NEW_DIR/"
```

### Step 4: Exit Auto-Started Claude + Resume

```bash
tmux send-keys -t [session]:[window] C-c
sleep 2
tmux send-keys -t [session]:[window] "/exit" Enter
sleep 5
tmux send-keys -t [session]:[window] "claude --resume [session-id]" Enter
```

### Step 5: Verify

```bash
sleep 5
maw peek [window]
# Token count > 0 = old context restored
```

---

## Rules

- **Always create gh issue** before working (Pulse visibility)
- **MCP first, hey after** — persistent before ephemeral
- **Feature branch + PR** — never push to main directly
- **Human approves** delete/close/done/sleep — Oracle works autonomously otherwise
- **Report to parent + reviewer** when done
- **Resume scans ~/.claude/projects/** not maw ls (sessions persist after done)

---

ARGUMENTS: $ARGUMENTS
