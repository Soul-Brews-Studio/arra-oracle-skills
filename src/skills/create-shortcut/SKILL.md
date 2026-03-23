---
name: create-shortcut
description: Create shell shortcuts and aliases for oracle-skills commands. Use when user says "create shortcut", "add alias", "make shortcut", "shortcut", or wants to save a command for quick access. Do NOT trigger for skill management (use /go) or profile switching.
argument-hint: "[list | create <name> <command> | delete <number>]"
---

# /create-shortcut - Command Shortcuts

Create, list, and delete shell shortcuts for oracle-skills commands.

## Usage

```
/create-shortcut                      # list all shortcuts
/create-shortcut list                 # list with numbers
/create-shortcut create gs "oracle-skills install -g --profile standard -y"
/create-shortcut delete 3             # delete by number
```

## How It Works

Shortcuts are stored in `~/.oracle-skills-shortcuts.json`.

You can also use the CLI directly:

```bash
oracle-skills shortcut                          # list
oracle-skills shortcut create <name> <command>  # create
oracle-skills shortcut delete <number>          # delete
oracle-skills shortcut <name>                   # run shortcut
```

## Mode 1: List (default)

```bash
cat ~/.oracle-skills-shortcuts.json 2>/dev/null || echo "[]"
```

Display each shortcut with number:

```
⚡ Shortcuts

   1. gs                  → oracle-skills install -g --profile standard -y
   2. gf                  → oracle-skills install -g -y
   3. mx                  → oracle-skills xray memory

Delete: /create-shortcut delete <number>
```

## Mode 2: Create

### `/create-shortcut create <name> <command>`

```bash
SHORTCUTS_FILE="$HOME/.oracle-skills-shortcuts.json"

# Read existing
SHORTCUTS=$(cat "$SHORTCUTS_FILE" 2>/dev/null || echo "[]")

# Add new
SHORTCUTS=$(echo "$SHORTCUTS" | jq --arg name "$NAME" --arg cmd "$CMD" '. + [{"name": $name, "command": $cmd}]')

# Write back
echo "$SHORTCUTS" > "$SHORTCUTS_FILE"
```

After creating, suggest adding to shell:

```
Add to ~/.zshrc or ~/.bashrc:

  alias gs='oracle-skills install -g --profile standard -y'
```

## Mode 3: Delete

### `/create-shortcut delete <number>`

Show the shortcut being deleted, ask confirmation, then remove:

```bash
# Remove by index (0-based internally, 1-based display)
jq "del(.[$INDEX])" "$SHORTCUTS_FILE" > /tmp/sc.json && mv /tmp/sc.json "$SHORTCUTS_FILE"
```

## Common Shortcuts

Suggest these when user has no shortcuts:

| Name | Command | Description |
|------|---------|-------------|
| `gs` | `oracle-skills install -g --profile standard -y` | Install standard |
| `gf` | `oracle-skills install -g -y` | Install full |
| `mx` | `oracle-skills xray memory` | Memory x-ray |
| `si` | `oracle-skills inspect` | Inspect skill |

---

ARGUMENTS: $ARGUMENTS
