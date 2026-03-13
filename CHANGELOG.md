# Changelog

## v3.0.4 (2026-03-13)

- Add `oracle-soul-sync-update` to all profiles (minimal/standard/full)
- Installed locally via `bun link`

## v3.0.3 (2026-03-13)

- Remove deprecated skills: `fyi`, `merged`, `retrospective`
- Skill count: 31 → 28
- Consolidate aliases (`retrospective` → `rrr`)

## v3.0.2 (2026-03-13)

- `/go` skill delegates to CLI instead of hardcoded bash
- `--feature` flag on `install` / `uninstall` commands
- Example: `oracle-skills install --feature soul`

## v3.0.1 (2026-03-13)

- CLI split from monolithic `index.ts` into `src/cli/commands/` directory
- New commands: `init`, `select`, `about`
- Auto-generated profile tables from data
- Profiles redesigned: data-driven from 1,013 sessions
  - `seed`/`minimal`: daily ritual (8 skills)
  - `standard`: daily driver + discovery (12 skills)
  - `full`: everything (28 skills)
- Features system: `soul`, `network`, `workspace`, `creator`

---

## Migration from v2.x → v3.x

### Breaking Changes

| Area | v2.0.10 | v3.0.4 |
|------|---------|--------|
| Skills | 31 | 28 (removed `fyi`, `merged`, `retrospective`) |
| CLI structure | Monolithic `src/cli.ts` | Modular `src/cli/commands/*.ts` |
| Profiles | `seed`, `minimal`, `standard`, `full` (simple lists) | Same names, data-driven composition + features |
| `/go` skill | Hardcoded bash commands | Delegates to `oracle-skills` CLI |

### New in v3

- **Commands**: `init`, `select`, `about` (not in v2)
- **Flags**: `--feature`, `--profile` on install/uninstall
- **Skill**: `/go` — switch profiles and features at runtime
- **Profiles**: `retrospective` renamed to `rrr`, `oracle-soul-sync-update` added to all
- **Features**: Composable add-on modules (`soul`, `network`, `workspace`, `creator`)

### Removed Skills

| Skill | Reason |
|-------|--------|
| `fyi` | Superseded by `/talk-to` + Oracle threads |
| `merged` | Rarely used, covered by git workflow |
| `retrospective` | Consolidated into `/rrr` |

### Upgrading

```bash
# From v2.x: reinstall with new profile
oracle-skills uninstall
oracle-skills install --profile standard

# Or install everything
oracle-skills install --profile full
```
