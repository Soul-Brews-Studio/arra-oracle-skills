---
name: oracle-soul-sync-update
description: "Sync Oracle instruments with the family — check installed version against latest, update skills CLI, and verify sync. Use when user says 'soul-sync', 'sync', 'calibrate', 'update', 'check for updates', 'am I up to date', or before /awaken. Do NOT trigger for installing individual skills (use /go), family registry lookups (use /oracle-family-scan), or general git sync operations."
---

# /oracle-soul-sync-update

> "Sync your soul with the family."

All-in-one skill: `/soul-sync` + `/calibrate` + `/update` combined.

## Usage

```
/oracle-soul-sync-update           # Check version and update
/oracle-soul-sync-update --check   # Only check, don't update
/oracle-soul-sync-update --cleanup # Uninstall first, then reinstall (removes old skills)
```

## Step 0: Timestamp
```bash
date "+🕐 %H:%M %Z (%A %d %B %Y)"
```

---

## Step 1: Check Current Version

Your current version is shown in the skill description above (e.g., `v1.5.37 G-SKLL`).

Extract just the version number:
```bash
# Current version from this skill's description
CURRENT="v1.5.37"  # Read from description above
echo "Current installed: $CURRENT"
```

---

## Step 2: Check Latest Version

```bash
# Get latest version from GitHub
LATEST=$(curl -s https://api.github.com/repos/Soul-Brews-Studio/arra-oracle-skills-cli/tags | grep -m1 '"name"' | cut -d'"' -f4)
echo "Latest available: $LATEST"
```

---

## Step 3: Compare Versions

```bash
if [ "$CURRENT" = "$LATEST" ]; then
  echo "✅ Soul synced! ($CURRENT)"
else
  echo "⚠️ Sync needed: $CURRENT → $LATEST"
fi
```

---

## Step 4: Sync (if needed)

If versions differ (or `--cleanup` flag), run:

**Normal sync:**
```bash
~/.bun/bin/bunx --bun arra-oracle-skills@github:Soul-Brews-Studio/arra-oracle-skills-cli#$LATEST install -g -y
```

**With `--cleanup` (removes old skills first):**
```bash
arra-oracle-skills uninstall -g -y && ~/.bun/bin/bunx --bun arra-oracle-skills@github:Soul-Brews-Studio/arra-oracle-skills-cli#$LATEST install -g -y
```

Then **restart Claude Code** to load the synced skills.

---

## Step 5: Verify Sync

After restart, run:
```bash
arra-oracle-skills list -g | head -5
```

Check that the version matches `$LATEST`.

---

## Step 6: What's New (optional)

```bash
gh release list --repo Soul-Brews-Studio/arra-oracle-skills-cli --limit 5
```

---

## Rules

- Run **before** `/awaken`, not during — requires a restart which breaks the wizard flow
- Skill management has moved to `/oracle` — use `/oracle install`, `/oracle remove`, `/oracle profile`
- After sync, **restart Claude Code** to load new skills

---

ARGUMENTS: $ARGUMENTS
