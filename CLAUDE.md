# Oracle Skills CLI

## Commands are Auto-Generated

**DO NOT manually edit `src/commands/*.md`** — they are auto-generated!

### How It Works

```
src/skills/         →  bun run compile  →  src/commands/
(SKILL.md files)                          (auto-generated stubs)
```

### Workflow

1. Edit skill in `src/skills/{name}/SKILL.md`
2. Run `bun run compile` to regenerate commands
3. Commands are committed via `bun run version`

### Creating New Skills

**IMPORTANT:** Every SKILL.md must have frontmatter with `name` and `description`:

```markdown
---
name: my-skill
description: Short description shown in skill list. Use when user says "trigger words".
---

# /my-skill

Full documentation here...
```

The compile script:
1. Reads `description` from frontmatter
2. Prepends version: `v{version} | {description}`
3. Generates command stub in `src/commands/`

**Without frontmatter:** Skill won't compile and shows as "(user)" in list.

### Installing Skills (Auto-Reload)

**DO NOT manually copy to `~/.claude/skills/`** — use the installer!

```bash
# Install specific skills (auto-reloads in Claude Code)
bun run src/cli/index.ts install -y -g --skill my-skill

# Install all skills
bun run src/cli/index.ts install -y -g
```

The installer:
1. Copies to `~/.claude/skills/`
2. Adds `installer: oracle-skills-cli v{version}` to frontmatter
3. Prepends `v{version} G-SKLL |` to description
4. Updates `.oracle-skills.json` manifest
5. **Auto-reloads** in Claude Code (no restart needed!)

### What Gets Generated

Each skill gets a command stub:

```markdown
---
description: v1.5.37 | [skill description]
---

# /{skill-name}

Execute the `{skill-name}` skill with the provided arguments.

## Instructions

1. Read the skill file: `{skillPath}/{skill-name}/SKILL.md`
2. Follow all instructions in the skill file
3. Pass these arguments to the skill: `$ARGUMENTS`
```

## Script Permissions

**All `.ts` and `.sh` scripts in `src/skills/*/scripts/` must have executable permission!**

```bash
# When creating new scripts, always set +x
chmod +x src/skills/my-skill/scripts/my-script.ts
```

**Why:** Scripts with shebang (`#!/usr/bin/env bun`) require `+x` to be invoked directly. Without it, you get "permission denied" even with correct shebang.

**Check all scripts:**
```bash
find src/skills -name "*.ts" ! -name "*.test.ts" -exec ls -la {} \; | grep -v rwx
```

## Skills with Hooks

Skills with `hooks/hooks.json` are installed as Claude Code plugins:

- Regular skills → `~/.claude/skills/`
- Skills with hooks → `~/.claude/plugins/`

Currently `ralph-loop-soulbrews` has hooks.

## Branch Strategy

**NEVER push directly to main.** Always use branches:

| Work Type | Branch | Merge |
|-----------|--------|-------|
| Alpha features | `alpha` | PR → main when stable |
| Bug fixes | `fix/name` | PR → alpha or main |
| Features | `feat/name` | PR → alpha |

```bash
# Alpha work (default)
git checkout alpha
# ... work, commit, push ...
# Tag alpha releases from alpha branch
git tag v3.3.0-alpha.N

# Stable release
gh pr create --base main --head alpha
# Merge PR → tag stable
```

**`/alpha-feature`** commits to `alpha` branch.
**`/release-alpha`** tags from `alpha` branch.

## Version Workflow

```bash
# Bump version
npm version 3.3.0-alpha.N --no-git-tag-version

# Compile + test
bun run compile
bun test

# Commit + tag (on alpha branch!)
git add -A && git commit
git tag vX.Y.Z-alpha.N
git push origin alpha --tags
```
