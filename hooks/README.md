# Hooks

Claude Code hooks for Oracle workflow automation.

## Install

```bash
cp hooks/*.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/*.sh
```

Then register in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "~/.claude/hooks/safety-check.sh", "timeout": 5 }] }
    ],
    "SessionStart": [
      { "hooks": [{ "type": "command", "command": "~/.claude/hooks/session-start.sh", "timeout": 10 }] }
    ],
    "UserPromptSubmit": [
      { "hooks": [{ "type": "command", "command": "~/.claude/hooks/auto-scale.sh", "timeout": 5 }] }
    ]
  },
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline-command.sh"
  }
}
```

## Hooks

| File | Event | What |
|------|-------|------|
| `auto-scale.sh` | UserPromptSubmit | Context display + auto /rrr every 100k + /forward every 195k |
| `safety-check.sh` | PreToolUse (Bash) | Block: force push, push main, rm -rf, --amend |
| `session-start.sh` | SessionStart | Show session ID, branch, issues, handoff |
| `statusline-command.sh` | statusLine | Custom 2-line statusline with thresholds |

## Configure

```bash
/auto-rrr status         # Check intervals
/auto-rrr rrr:150k       # Change /rrr interval
/auto-rrr off            # Disable auto-triggers
```
