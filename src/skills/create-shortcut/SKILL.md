---
name: create-shortcut
description: Create local skills as shortcuts — makes real /commands in .claude/skills/. Use when user says "create shortcut", "create skill", "make a command for", "add shortcut", or wants a quick custom /slash-command. Also lists and deletes local skills.
argument-hint: "[list | create <name> <description> | delete <name>]"
---

# /create-shortcut - Local Skill Factory

Create real local skills (`.claude/skills/<name>/SKILL.md`) that show up as `/commands` in autocomplete.

## Usage

```
/create-shortcut                              # list local skills
/create-shortcut list                         # same, with numbers
/create-shortcut create deploy "Run tests then deploy"
/create-shortcut delete deploy                # delete by name
/create-shortcut delete 3                     # delete by number
```

## How It Works

Creates a SKILL.md in `.claude/skills/<name>/` (project-local) or `~/.claude/skills/<name>/` (global with `--global`).

The skill immediately appears in `/` autocomplete after creation.

---

## Mode 1: List (default)

Scan both local and global skills directories:

```bash
LOCAL_DIR=".claude/skills"
GLOBAL_DIR="$HOME/.claude/skills"
```

For each directory, list skill folders and show:

```
⚡ Local Skills (.claude/skills/)

   1. deploy              Run tests then deploy to prod
   2. lint-fix            Fix all linting errors
   3. db-migrate          Run database migrations

⚡ Global Skills (~/.claude/skills/)

   4. trace (v3.4.8)      [core] Find projects, code...
   5. recap (v3.4.8)      [core] Session orientation...
   ...

Delete local: /create-shortcut delete <name or number>
```

Mark core (oracle-skills-cli installed) skills with `[core]`. Local skills have no tag.

---

## Mode 2: Create

### `/create-shortcut create <name> [description]`

If description not provided, ask:

```
What should /<name> do?
```

Then create the skill:

```bash
SKILL_DIR=".claude/skills/<name>"
mkdir -p "$SKILL_DIR"
```

Write `SKILL.md`:

```markdown
---
name: <name>
description: <description>
---

# /<name>

<description>

## Instructions

<Ask user what the skill should do, or generate from description>

---

ARGUMENTS: $ARGUMENTS
```

**After creating**, confirm:

```
✅ Created /<name>

  📁 .claude/skills/<name>/SKILL.md
  📝 <description>

  Try it: /<name>
```

### With --global flag

```
/create-shortcut create deploy "Deploy to prod" --global
```

Creates in `~/.claude/skills/` instead of `.claude/skills/`.

---

## Mode 3: Delete

### `/create-shortcut delete <name or number>`

1. Find the skill (by name or list number)
2. Show its content
3. Ask confirmation: "Delete /<name>? (yes/no)"
4. If yes:
   - Move to trash (Nothing is Deleted): `mv .claude/skills/<name> .claude/skills/.trash/<name>_$(date +%Y%m%d_%H%M%S)`
   - Create `.trash/` if needed: `mkdir -p .claude/skills/.trash`
   - Confirm: "Archived: /<name> → .claude/skills/.trash/"
5. If no: "Kept: /<name>"

**Only delete local skills.** Never delete global/core skills — warn instead:

```
⚠️ <name> is a core skill (installed by oracle-skills-cli).
   Use 'oracle-skills uninstall -s <name>' to remove it.
```

---

## Examples

```
/create-shortcut create deploy "Build, test, and deploy to Cloudflare Workers"
/create-shortcut create db-seed "Reset and seed the development database"
/create-shortcut create pr-review "Review the current PR with checklist"
/create-shortcut create morning "Run standup + check inbox + show schedule"
```

---

ARGUMENTS: $ARGUMENTS
