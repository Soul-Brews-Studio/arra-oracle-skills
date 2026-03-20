---
name: project
description: Clone and track external repos. Use when user shares GitHub URL to study or develop, or says "search repos", "find repo", "where is [project]". Actions - learn (clone for study), incubate (clone for development), search/find (search repos), list (show tracked).
argument-hint: "<github-url> | search <query>"
---

# project-manager

Track and manage external repos: Learn (study) | Incubate (develop)

## Golden Rule

**ghq owns the clone → ψ/ owns the symlink**

Never copy. Always symlink. One source of truth.

## When to Use

Invoke this skill when:
- User shares a GitHub URL and wants to study/clone it
- User mentions wanting to learn from a codebase
- User wants to start developing on an external repo
- Need to find where a previously cloned project lives

## Actions

### learn [url|slug]

Clone repo for **study** (read-only reference).

```bash
# 1. Clone via ghq
ghq get -u https://github.com/owner/repo

# 2. Create org/repo symlink structure
GHQ_ROOT=$(ghq root)
mkdir -p ψ/learn/owner
ln -sf "$GHQ_ROOT/github.com/owner/repo" ψ/learn/owner/repo
```

**Output**: "✓ Linked [repo] to ψ/learn/owner/repo"

### incubate [url|slug] [--offload|--contribute|--flash]

Clone repo for **active development** with optional workflow flags.

```bash
# Same flow, different target
ghq get -u https://github.com/owner/repo
GHQ_ROOT=$(ghq root)
mkdir -p ψ/incubate/owner
ln -sf "$GHQ_ROOT/github.com/owner/repo" ψ/incubate/owner/repo
```

**Output**: "✓ Linked [repo] to ψ/incubate/owner/repo"

#### Workflow Flags

| Flag | Scope | Duration | Cleanup |
|------|-------|----------|---------|
| (none) | Long-term dev | Weeks/months | Manual |
| `--offload` | Manual trigger | — | Remove symlink (keep ghq) |
| `--contribute` | Multi-feature | Days/weeks | Offload when all done (keep ghq for PR feedback) |
| `--flash` | Single fix | Minutes | Issue → PR → offload → purge (one shot) |

#### --offload

Remove symlink after work is done (manual trigger):

```bash
unlink ψ/incubate/owner/repo
rmdir ψ/incubate/owner 2>/dev/null
# ghq clone preserved for future use
```

#### --contribute

For multi-feature contributions over days/weeks. Offload when ALL features are done:

```bash
# 1. Work on multiple features/fixes over time
git -C ψ/incubate/owner/repo checkout -b feat/feature-1
# ... work, commit, push, PR ...
git -C ψ/incubate/owner/repo checkout -b feat/feature-2
# ... work, commit, push, PR ...

# 2. When all done, offload (ghq kept for PR feedback)
unlink ψ/incubate/owner/repo
```

**Use case**: Extended contribution period. Keep ghq for addressing PR reviews.

#### --flash

Complete contribution cycle with full cleanup:

```
/project incubate URL --flash
    ↓
1. gh issue create → #N (document intent)
    ↓
2. ghq get → symlink to ψ/incubate/
    ↓
3. git checkout -b issue-N-description
    ↓
4. Make changes, commit
    ↓
5. git push → gh pr create --body "Closes #N"
    ↓
6. cd back to main repo
    ↓
7. Auto-offload + purge ghq clone
    ↓
"✓ Issue #N → PR #M → Offloaded & Purged"
```

**Use case**: Quick external contributions without leaving traces.

### find [query]

Search for project across all locations:

```bash
# Search ghq repos
ghq list | grep -i "query"

# Search learn/incubate symlinks (org/repo structure)
find ψ/learn ψ/incubate -type l 2>/dev/null | grep -i "query"
```

**Output**: List matches with their ghq paths

### list

Show all tracked projects:

```bash
echo "📚 Learn"
find ψ/learn -type l 2>/dev/null | while read link; do
  target=$(readlink "$link")
  echo "  ${link#ψ/learn/} → $target"
done

echo "🌱 Incubate"
find ψ/incubate -type l 2>/dev/null | while read link; do
  target=$(readlink "$link")
  echo "  ${link#ψ/incubate/} → $target"
done

echo "🏠 External (ghq)"
ghq list | grep -v "laris-co/Nat-s-Agents" | head -10
```

## Directory Structure

```
ψ/
├── learn/owner/repo     → ~/Code/github.com/owner/repo  (symlink)
└── incubate/owner/repo  → ~/Code/github.com/owner/repo  (symlink)

~/Code/               ← ghq root (source of truth)
└── github.com/owner/repo/  (actual clone)
```

## Health Check

When listing, verify symlinks are valid:

```bash
# Check for broken symlinks
find ψ/learn ψ/incubate -type l ! -exec test -e {} \; -print 2>/dev/null
```

If broken: `ghq get -u [url]` to restore source.

## Examples

```
# User shares URL to study
User: "I want to learn from https://github.com/SawyerHood/dev-browser"
→ ghq get -u https://github.com/SawyerHood/dev-browser
→ mkdir -p ψ/learn/SawyerHood
→ ln -sf ~/Code/github.com/SawyerHood/dev-browser ψ/learn/SawyerHood/dev-browser

# User wants to develop long-term
User: "I want to work on claude-mem"
→ /project incubate https://github.com/thedotmack/claude-mem
→ Symlink created, work until done

# User wants to contribute (keep ghq for follow-up)
User: "Fix a bug in arra-oracle"
→ /project incubate https://github.com/Soul-Brews-Studio/arra-oracle --contribute
→ [edit, commit, push]
→ Auto-offload, ghq kept for PR feedback

# User wants quick flash contribution (full cleanup)
User: "Quick README fix on oracle-skills-cli"
→ /project incubate https://github.com/Soul-Brews-Studio/oracle-skills-cli --flash
→ Issue #17 created
→ Branch: issue-17-fix-readme
→ [edit, commit, push]
→ PR #18 created (Closes #17)
→ Auto-offload + purge
→ "✓ Issue #17 → PR #18 → Offloaded & Purged"
```

## Anti-Patterns

| ❌ Wrong | ✅ Right |
|----------|----------|
| `git clone` directly to ψ/ | `ghq get` then symlink |
| Flat: `ψ/learn/repo-name` | Org structure: `ψ/learn/owner/repo` |
| Copy files | Symlink always |
| Manual clone outside ghq | Everything through ghq |

## Quick Reference

```bash
# Add to learn
ghq get -u URL && mkdir -p ψ/learn/owner && ln -sf "$(ghq root)/github.com/owner/repo" ψ/learn/owner/repo

# Add to incubate
ghq get -u URL && mkdir -p ψ/incubate/owner && ln -sf "$(ghq root)/github.com/owner/repo" ψ/incubate/owner/repo

# Offload (remove symlink only)
unlink ψ/incubate/owner/repo && rmdir ψ/incubate/owner 2>/dev/null

# Offload + purge (remove symlink AND ghq clone)
unlink ψ/incubate/owner/repo && rm -rf "$(ghq root)/github.com/owner/repo"

# Update source
ghq get -u URL

# Find repo
ghq list | grep name
```

## Workflow Intensity Scale

```
incubate        → Long-term dev (manual cleanup)
    ↓
--contribute    → Push → offload (keep ghq)
    ↓
--flash         → Issue → Branch → PR → offload → purge (complete cycle)
```
