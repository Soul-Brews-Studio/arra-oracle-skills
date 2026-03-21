---
name: alpha-feature
description: Quickly create a new skill, add to repo, compile, test, and release alpha. Use when user says "alpha feature", "new skill", "add skill", "create skill for", or wants to add a new capability to oracle-skills-cli. Do NOT trigger for /awaken (Oracle birth), /skill-creator (eval/optimize), or general code changes.
argument-hint: "<skill-name> [description]"
---

# /alpha-feature — Quick Skill Creation + Alpha Release

One command: create skill → compile → test → commit → alpha release.

## Usage

```
/alpha-feature whats-next "Suggest next action from context"
/alpha-feature my-skill                # Interactive — ask for description
```

## Steps

### 1. Parse Input

- `$ARGUMENTS[0]` = skill name (kebab-case)
- Rest = description (optional, ask if missing)

If no arguments, ask:
- "What should the skill be called?" (kebab-case)
- "What does it do?" (one sentence)
- "When should it trigger?" (user phrases)

### 2. Create Skill

Create `src/skills/<name>/SKILL.md`:

```markdown
---
name: <name>
description: <description>. Use when user says "<triggers>". Do NOT trigger for <anti-triggers>.
argument-hint: "<hint>"
---

# /<name>

<Instructions based on user's description>

ARGUMENTS: $ARGUMENTS
```

Follow Anthropic skill-creator best practices:
- Description 50+ words with explicit triggers
- Anti-triggers to avoid conflicts with existing skills
- Imperative form instructions
- Keep under 100 lines for simple skills

### 3. Compile + Test

```bash
bun run compile
bun test
```

If tests fail → fix before continuing.

### 4. Bump Version + Release

```bash
# Read current version, increment alpha
CURRENT=$(jq -r '.version' package.json)
# If X.Y.Z-alpha.N → X.Y.Z-alpha.(N+1)
npm version <next> --no-git-tag-version
bun run compile
```

### 5. Commit + Tag + Release

```bash
git add -A
git commit -m "feat: add /<name> skill — <short description>"
git push origin main
git tag v<version>
git push origin v<version>
gh release create v<version> --prerelease --title "v<version> — /<name>" --generate-notes
```

### 6. Install Locally

```bash
bun run dev -- install -g -y
```

### 7. Output

```markdown
## ✨ New Skill: /<name>

**Version**: v<version>
**Release**: https://github.com/.../releases/tag/v<version>
**Tests**: 110 pass

Installed locally. Restart session to activate.

Install:
bunx --bun oracle-skills@github:Soul-Brews-Studio/oracle-skills-cli#v<version> install -g -y
```

## Rules

- Always add anti-triggers based on existing skill conflicts
- Always run tests before releasing
- Always use `--prerelease` flag for alpha
- Never create skills that duplicate existing ones — check `/skills` list first
- Keep SKILL.md lean — under 100 lines for simple skills

ARGUMENTS: $ARGUMENTS
