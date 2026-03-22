# oracle-skills

18 skills for AI coding agents. 18 agents supported.

## Install

```bash
bunx --bun oracle-skills@github:Soul-Brews-Studio/oracle-skills-cli install -g -y
```

## Profiles

```
oracle-skills init                    # minimal (8 skills, default)
oracle-skills init -p standard        # standard (13 skills)
oracle-skills install -g -y           # full (all skills)
oracle-skills select -g               # interactive picker
oracle-skills uninstall -g -y         # remove all
```

## Switch

```
/go minimal          /go standard          /go full
/go + soul           /go + network         /go + workspace         /go + creator
```

<!-- profiles:start -->

| Profile | Count | Skills |
|---------|-------|--------|
| **minimal** | 8 | `forward`, `retrospective`, `recap`, `standup`, `go`, `about-oracle`, `oracle-family-scan`, `oracle-soul-sync-update` |
| **standard** | 12 | `forward`, `retrospective`, `recap`, `standup`, `trace`, `learn`, `talk-to`, `oracle-family-scan`, `go`, `about-oracle`, `oracle-soul-sync-update`, `awaken` |
| **full** | 18 | all |

Switch anytime: `/go minimal`, `/go standard`, `/go full`, `/go + soul`

**Features** (stack on any profile with `/go + feature`):

| Feature | Skills |
|---------|--------|
| **+soul** | `awaken`, `philosophy`, `who-are-you`, `about-oracle` |
| **+network** | `talk-to`, `oracle-family-scan`, `oracle-soul-sync-update` |
| **+workspace** | `schedule`, `project` |

<!-- profiles:end -->

## Skills

<!-- skills:start -->

| # | Skill | Type | Description |
|---|-------|------|-------------|
| 1 | **about-oracle** | skill + subagent | What is Oracle |
| 2 | **learn** | skill + subagent | Explore a codebase |
| 3 | **trace** | skill + subagent | Find projects, code |
| - |  |  |  |
| 4 | **oracle-family-scan** | skill + code | Oracle Family Registry |
| 5 | **project** | skill + code | Clone and track external repos |
| 6 | **recap** | skill + code | Session orientation and awareness |
| 7 | **schedule** | skill + code | Query schedule via Oracle API (Drizzle DB) |
| - |  |  |  |
| 8 | **auto-retrospective** | skill | Configure auto-rrr |
| 9 | **awaken** | skill | Guided Oracle birth and awakening ritual |
| 10 | **forward** | skill | Create handoff + enter plan mode for next |
| 11 | **go** | skill | Switch skill profiles and features |
| 12 | **oracle-soul-sync-update** | skill | Sync Oracle instruments with the family |
| 13 | **philosophy** | skill | Display Oracle philosophy |
| 14 | **retrospective** | skill | Quick session retrospective |
| 15 | **standup** | skill | Daily standup check |
| 16 | **talk-to** | skill | Talk to another Oracle agent via threads |
| 17 | **where-we-are** | skill | Session awareness |
| 18 | **who-are-you** | skill | Know ourselves |

<!-- skills:end -->

## Agents

Claude Code, OpenCode, Codex, Cursor, Amp, Kilo Code, Roo Code, Goose, Gemini CLI, Antigravity, GitHub Copilot, OpenClaw, Droid, Windsurf, Cline, Aider, Continue, Zed

## Origin

[Nat Weerawan](https://github.com/nazt) — [Soul Brews Studio](https://github.com/Soul-Brews-Studio) · MIT
