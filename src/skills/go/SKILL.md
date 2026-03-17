---
name: go
description: Switch skill profiles and features. Enable/disable skills instantly. Use when user says "go", "go minimal", "go standard", "go + soul", "switch profile", "enable skills", "disable skills".
argument-hint: "<minimal|standard|full> [+ soul|network|workspace|creator]"
---

# /go

> Switch gear. Single source of truth.

## Usage

```
/go                     # show installed skills
/go minimal             # switch to minimal profile
/go standard            # switch to standard profile
/go full                # enable everything
/go reset               # alias for full
/go + soul              # add soul feature
/go + creator network   # add multiple features
/go - workspace         # remove feature
/go minimal + soul      # profile + feature
/go enable trace dig    # enable specific skills
/go disable watch       # disable specific skills
```

---

## Execution

Parse the user's `/go` arguments and run the matching `oracle-skills` CLI command.

**Always use `oracle-skills` CLI** — profiles and features are defined in `profiles.ts`, the single source of truth.

### `/go` (no args) — show current state

```bash
oracle-skills list -g
```

### `/go <profile>` — switch profile

```bash
oracle-skills install -g --profile <name> -y
```

Profiles: `minimal`, `standard`, `full`, `seed`

- `/go minimal` → `oracle-skills install -g --profile minimal -y`
- `/go standard` → `oracle-skills install -g --profile standard -y`

### `/go full` or `/go reset` — enable everything

```bash
oracle-skills install -g -y
```

No `--profile` flag = all skills.

### `/go <profile> + <feature...>` — profile with features

```bash
oracle-skills install -g --profile <name> --feature <feat...> -y
```

- `/go minimal + soul` → `oracle-skills install -g --profile minimal --feature soul -y`
- `/go standard + soul creator` → `oracle-skills install -g --profile standard --feature soul creator -y`

### `/go + <feature...>` — add features (no profile change)

```bash
oracle-skills install -g --feature <feat...> -y
```

Additive — installs feature skills without removing existing ones.

- `/go + soul` → `oracle-skills install -g --feature soul -y`
- `/go + creator network` → `oracle-skills install -g --feature creator network -y`

### `/go - <feature...>` — remove features

```bash
oracle-skills uninstall -g --feature <feat...> -y
```

- `/go - workspace` → `oracle-skills uninstall -g --feature workspace -y`

### `/go enable <skill...>` — enable specific skills

```bash
oracle-skills install -g -s <skill...> -y
```

- `/go enable trace dig` → `oracle-skills install -g -s trace dig -y`

### `/go disable <skill...>` — disable specific skills

```bash
oracle-skills uninstall -g -s <skill...> -y
```

- `/go disable watch` → `oracle-skills uninstall -g -s watch -y`

---

## Available Profiles

| Profile | Count | Description |
|---------|-------|-------------|
| **minimal** | 7 | Daily ritual — forward, retrospective, recap, standup, go, about-oracle, oracle-family-scan |
| **standard** | 11 | Daily driver + discovery (default) |
| **full** | all | Everything |

## Available Features

| Feature | Skills | Notes |
|---------|--------|-------|
| **soul** | awaken, philosophy, who-are-you, about-oracle, birth, feel | Wizard v2: demographics, fast/full mode, system check |
| **network** | talk-to, oracle-family-scan, oracle-soul-sync-update, oracle, oraclenet | Registry now tracks demographics |
| **workspace** | worktree, physical, schedule | |
| **creator** | speak, deep-research, watch, gemini | |

### Soul Feature (Wizard v2 Enhancements)

The `soul` feature now supports `/awaken` wizard v2:
- **Fast mode** (~5 min): Philosophy fed directly, no trace/learn
- **Full Soul Sync** (~20 min): Deep trace + discover principles
- **Demographics**: Gender, team, memory consent collected during birth
- **System check**: Git identity, gh CLI, bun auto-detected in Phase 0
- Skills in soul feature read demographics from CLAUDE.md when available

---

## Rules

1. **Always `-g`** — global (user-level) skills
2. **Always `-y`** — skip confirmation
3. **Restart required** — agent loads skills at session start
4. **`go` is always preserved** — it's in every profile
5. **Show result** — after running the command, tell the user what changed and remind them to restart

---

ARGUMENTS: $ARGUMENTS
