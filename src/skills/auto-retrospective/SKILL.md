---
name: auto-retrospective
hidden: true
description: Configure auto-rrr and auto-forward triggers based on context window usage. Use when user says "auto rrr", "auto-scale", "configure auto triggers", "change rrr interval", "toggle auto", or wants to adjust when /rrr and /forward auto-trigger. Do NOT trigger for running /rrr manually (use /rrr) or creating handoffs (use /forward).
argument-hint: "[on | off | status | rrr:<interval>k | fwd:<interval>k]"
---

# /auto-retrospective — Configure Auto-Trigger Settings

Manage the auto-scale hook that triggers /rrr and /forward based on context window usage.

## Usage

```
/auto-rrr                # Show current status
/auto-rrr on             # Enable auto-triggers
/auto-rrr off            # Disable auto-triggers
/auto-rrr status         # Show thresholds + next triggers
/auto-rrr rrr:150k       # Set /rrr interval to every 150k tokens
/auto-rrr fwd:200k       # Set /forward interval to every 200k tokens
/auto-rrr rrr:100k fwd:195k  # Set both
```

## How It Works

Auto-scale hook (`~/.claude/hooks/auto-scale.sh`) runs on every `UserPromptSubmit`:
1. Reads context usage from `/tmp/statusline-raw.json`
2. Shows status line: `10:20 | 46k (rrr:100k fwd:195k) | white.local | auto:on`
3. At threshold: injects message telling AI to run /rrr or /forward
4. Uses flag files per session to avoid re-triggering

## Steps

### status (default, no args)

```bash
TDIR="${TMPDIR:-${TMP:-${TEMP:-/tmp}}}"
HOOK="$HOME/.claude/hooks/auto-scale.sh"

# Current intervals
grep "RRR_INTERVAL=" "$HOOK" | head -1
grep "FWD_INTERVAL=" "$HOOK" | head -1

# Toggle status
[ -f "$TDIR/claude-auto-scale-off" ] && echo "auto: OFF" || echo "auto: ON"

# Current context
cat "$TDIR/statusline-raw.json" 2>/dev/null | jq -r '"Context: \(.context_window.used_percentage)% (\((.context_window.current_usage | ((.input_tokens//0)+(.cache_creation_input_tokens//0)+(.cache_read_input_tokens//0)+(.output_tokens//0))) / 1000 | floor))k)"'
```

Display:
```
Auto-RRR Status:
  /rrr every 100k tokens
  /forward every 195k tokens
  Toggle: ON
  Context: 14% (46k)
  Next /rrr: 100k
  Next /forward: 195k
```

### on

```bash
TDIR="${TMPDIR:-${TMP:-${TEMP:-/tmp}}}"
rm -f "$TDIR/claude-auto-scale-off"
```

### off

```bash
TDIR="${TMPDIR:-${TMP:-${TEMP:-/tmp}}}"
touch "$TDIR/claude-auto-scale-off"
```

### rrr:<N>k / fwd:<N>k

Update the interval in the hook script:

```bash
HOOK="$HOME/.claude/hooks/auto-scale.sh"
# For rrr:150k
sed -i 's/RRR_INTERVAL=.*/RRR_INTERVAL=150/' "$HOOK"
# For fwd:200k
sed -i 's/FWD_INTERVAL=.*/FWD_INTERVAL=200/' "$HOOK"
```

Then clear session flags to apply immediately:

```bash
TDIR="${TMPDIR:-${TMP:-${TEMP:-/tmp}}}"
rm -f "$TDIR/claude-auto-rrr-"* "$TDIR/claude-auto-fwd-"*
```

Show updated status after any change.

## Hook Location

`~/.claude/hooks/auto-scale.sh` — registered in `~/.claude/settings.json` under `UserPromptSubmit`.

If hook doesn't exist, tell user to create it or run the setup.

ARGUMENTS: $ARGUMENTS
