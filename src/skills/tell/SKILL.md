---
name: tell
description: Send one-way command to another Oracle via maw hey. Fire and forget — no reply expected. Use when user says "tell", "hey", "บอก", "send to", or wants to dispatch a command to another agent without waiting. Do NOT trigger for two-way messaging (use /talk-to), spawning new Oracle (use /wake), or transferring work (use /handover).
argument-hint: "<oracle-name> <message>"
---

# /tell — One-Way Command Dispatch

Send instruction to another Oracle and move on. No waiting.

## Usage

```
/tell neo "fix #109"
/tell pulse "alpha.10 released, triage issues"
/tell hermes "check LINE messages"
```

## Steps

### 1. Parse

- `$ARGUMENTS[0]` = oracle name
- Rest = message

### 2. Send

```bash
maw hey <oracle-name> "<message>"
```

### 3. Output

```
→ Sent to <oracle-name>: "<message>"
```

Done. No reply tracking. Move on.

## Rules

- Fire and forget — never wait for reply
- If oracle not found by maw, show error
- Keep message as-is — don't modify or summarize

ARGUMENTS: $ARGUMENTS
