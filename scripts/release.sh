#!/bin/bash
set -e

# Release script for oracle-skills-cli
# Usage: ./scripts/release.sh [patch|minor|major]
#        ./scripts/release.sh 1.5.37  (specific version)
#
# Safety: must be on main branch, clean working tree, not in a worktree

# Guard: must be on main
BRANCH=$(git branch --show-current)
if [[ "$BRANCH" != "main" ]]; then
  echo "ERROR: releases must be cut from main (currently on '$BRANCH')"
  echo "Merge your PR first, then run this script on main."
  exit 1
fi

# Guard: must not be in a worktree
if [[ "$(git rev-parse --git-common-dir)" != "$(git rev-parse --git-dir)" ]]; then
  echo "ERROR: cannot release from a worktree — switch to the main repo checkout"
  exit 1
fi

# Guard: working tree must be clean
if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: working tree is not clean — commit or stash changes first"
  exit 1
fi

CURRENT=$(grep '"version"' package.json | head -1 | cut -d'"' -f4)
echo "Current version: $CURRENT"

# Determine new version
if [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  NEW_VERSION="$1"
elif [[ "$1" == "major" ]]; then
  NEW_VERSION=$(echo $CURRENT | awk -F. '{print $1+1".0.0"}')
elif [[ "$1" == "minor" ]]; then
  NEW_VERSION=$(echo $CURRENT | awk -F. '{print $1"."$2+1".0"}')
else
  # Default: patch
  NEW_VERSION=$(echo $CURRENT | awk -F. '{print $1"."$2"."$3+1}')
fi

echo "New version: $NEW_VERSION"
echo ""

# Confirm
read -p "Release v$NEW_VERSION? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 1
fi

echo ""

# Run tests first
echo "🧪 Running tests..."
bun test __tests__/
echo ""

echo "📦 Bumping version..."

# 1. Update package.json (portable sed — works on macOS and Linux)
if [[ "$(uname)" == "Darwin" ]]; then
  sed -i '' "s/\"version\": \"$CURRENT\"/\"version\": \"$NEW_VERSION\"/" package.json
  find src/skills -name "SKILL.md" -exec sed -i '' "s/v$CURRENT/v$NEW_VERSION/g" {} \;
else
  sed -i "s/\"version\": \"$CURRENT\"/\"version\": \"$NEW_VERSION\"/" package.json
  find src/skills -name "SKILL.md" -exec sed -i "s/v$CURRENT/v$NEW_VERSION/g" {} \;
fi

# 3. Compile skills
echo "🔮 Compiling skills..."
bun run compile

# 4. Commit
echo "📝 Committing..."
git add -A
git commit -m "release: v$NEW_VERSION"

# 5. Push
echo "🚀 Pushing to main..."
git push origin main

# 6. Tag
echo "🏷️  Creating tag v$NEW_VERSION..."
git tag "v$NEW_VERSION"
git push origin "v$NEW_VERSION"

echo ""
echo "✅ Released v$NEW_VERSION!"
echo ""
echo "GitHub Actions will now:"
echo "  1. Run tests"
echo "  2. Create GitHub Release"
echo ""
echo "Check: https://github.com/Soul-Brews-Studio/oracle-skills-cli/actions"
