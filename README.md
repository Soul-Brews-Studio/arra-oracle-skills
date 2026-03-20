# oracle-skills

29 skills for AI coding agents. 18 agents supported. Install once, use everywhere.

## Install

```bash
bunx --bun oracle-skills@github:Soul-Brews-Studio/oracle-skills-cli install -g -y
```

## Profiles

| Profile | Count | What |
|---------|-------|------|
| minimal | 8 | Daily ritual: forward, rrr, recap, standup, go |
| standard | 13 | + discovery: trace, dig, learn, talk-to, awaken |
| full | 31 | Everything |

Switch: `/go minimal`, `/go standard`, `/go full`, `/go + soul`

Features stack on any profile: `+soul`, `+network`, `+workspace`, `+creator`

<!-- profiles:start -->

| Profile | Count | Skills |
|---------|-------|--------|
| **minimal** | 8 | `forward`, `rrr`, `recap`, `standup`, `go`, `about-oracle`, `oracle-family-scan`, `oracle-soul-sync-update` |
| **standard** | 13 | `forward`, `rrr`, `recap`, `standup`, `trace`, `dig`, `learn`, `talk-to`, `oracle-family-scan`, `go`, `about-oracle`, `oracle-soul-sync-update`, `awaken` |
| **full** | 29 | all |

Switch anytime: `/go minimal`, `/go standard`, `/go full`, `/go + soul`

**Features** (stack on any profile with `/go + feature`):

| Feature | Skills |
|---------|--------|
| **+soul** | `awaken`, `philosophy`, `who-are-you`, `about-oracle`, `birth`, `feel` |
| **+network** | `talk-to`, `oracle-family-scan`, `oracle-soul-sync-update`, `oracle` |
| **+workspace** | `worktree`, `workon`, `schedule` |
| **+creator** | `speak`, `deep-research`, `watch`, `gemini` |

<!-- profiles:end -->

## Skills

<!-- skills:start -->

| # | Skill | Type | Description |
|---|-------|------|-------------|
| 1 | **about-oracle** | skill + subagent | What is Oracle |
| 2 | **learn** | skill + subagent | Explore a codebase |
| 3 | **mine** | skill + subagent | Extract a specific topic from ONE session |
| 4 | **rrr** | skill + subagent | Create session retrospective with AI diary |
| 5 | **trace** | skill + subagent | Find projects, code |
| 6 | **xray** | skill + subagent | Full anatomy scan of ONE session JSONL |
| - |  |  |  |
| 7 | **deep-research** | skill + code | Deep Research via Gemini |
| 8 | **gemini** | skill + code | Control Gemini via MQTT WebSocket |
| 9 | **oracle-family-scan** | skill + code | Oracle Family Registry |
| 10 | **project** | skill + code | Clone and track external repos |
| 11 | **recap** | skill + code | Session orientation and awareness |
| 12 | **schedule** | skill + code | Query schedule via Oracle API (Drizzle DB) |
| 13 | **speak** | skill + code | Text-to-speech using edge-tts or macOS say |
| 14 | **watch** | skill + code | Learn from YouTube videos |
| - |  |  |  |
| 15 | **awaken** | skill | Guided Oracle birth and awakening ritual |
| 16 | **birth** | skill | Prepare birth props for a new Oracle repo |
| 17 | **dig** | skill | Mine Claude Code sessions |
| 18 | **feel** | skill | Log emotions with optional structure |
| 19 | **forward** | skill | Create handoff + enter plan mode for next |
| 20 | **go** | skill | Switch skill profiles and features |
| 21 | **oracle** | skill | Manage Oracle skills |
| 22 | **oracle-soul-sync-update** | skill | Sync Oracle instruments with the family |
| 23 | **philosophy** | skill | Display Oracle philosophy |
| 24 | **standup** | skill | Daily standup check |
| 25 | **talk-to** | skill | Talk to another Oracle agent via threads |
| 26 | **where-we-are** | skill | Session awareness |
| 27 | **who-are-you** | skill | Know ourselves |
| 28 | **workon** | skill | Work on an issue OR resume a killed worktree |
| 29 | **worktree** | skill | Git worktree for parallel work |

<!-- skills:end -->

## Agents

Claude Code, OpenCode, Codex, Cursor, Amp, Kilo Code, Roo Code, Goose, Gemini CLI, Antigravity, GitHub Copilot, OpenClaw, Droid, Windsurf, Cline, Aider, Continue, Zed

## CLI

```
oracle-skills install -g -y      # install all
oracle-skills init               # standard profile
oracle-skills select -g          # interactive picker
oracle-skills uninstall -g -y    # remove all
oracle-skills list -g            # show installed
oracle-skills agents             # detected agents
oracle-skills about              # system status
```

## Private Skills

Some skills are distributed separately:

| Skill | Repo | Install |
|-------|------|---------|
| oraclenet | `Soul-Brews-Studio/oraclenet-skill` (private) | `ghq get -p Soul-Brews-Studio/oraclenet-skill && cp -r $(ghq root)/github.com/Soul-Brews-Studio/oraclenet-skill/oraclenet ~/.claude/skills/` |

Uninstall: `rm -rf ~/.claude/skills/<skill-name>`

## Origin

[Nat Weerawan](https://github.com/nazt) — [Soul Brews Studio](https://github.com/Soul-Brews-Studio) · MIT
