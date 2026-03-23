---
name: memory
description: Scan and manage Claude Code auto-memory — list, read, stats, clean. Use when user says "memory", "scan memory", "what do you remember", "show memories", "memory stats", "forget", or wants to inspect what the AI remembers across sessions. Do NOT trigger for Oracle vault/ψ (use /trace), session handoffs (use /inbox), or session history (use /dig).
argument-hint: "[scan | read <name> | stats | types | clean | forget <name>]"
---

# /memory - Memory Scanner

Inspect and manage Claude Code's auto-memory for the current project.

## Memory Location

```bash
ENCODED=$(pwd | sed 's|^/|-|; s|/|-|g')
MEMORY_DIR="$HOME/.claude/projects/${ENCODED}/memory"
```

## Usage

```
/memory                   # Scan — list all memories with types
/memory scan              # Same as above
/memory read <name>       # Read a specific memory file
/memory stats             # Show counts by type, total size, age
/memory types             # Group memories by type
/memory clean             # Find stale/outdated memories
/memory forget <name>     # Remove a memory (after confirmation)
```

---

## Mode 1: Scan (default)

List all memory files with type, age, and description.

```bash
MEMORY_DIR="$HOME/.claude/projects/$(pwd | sed 's|^/|-|; s|/|-|g')/memory"
```

Read each `.md` file (except MEMORY.md), extract frontmatter:

For each file, display:

```
🧠 Memory Scanner — [project name]

  Type        Name                              Age     Description
  ─────────── ───────────────────────────────── ─────── ────────────────────────
  feedback    never_push_main_skills            2d      Always use branch + PR
  feedback    talk_to_not_oracle_thread         9d      Use /talk-to for threads
  reference   maw_cli                           9d      maw hey, peek, ls commands
  reference   pulse_cli                         9d      board, timeline, scan
  user        work_patterns                     9d      maker's schedule, peak hours

  Total: 14 memories (5 feedback, 3 reference, 1 user, 0 project)
  Index: MEMORY.md (60 lines)
```

### How to parse

For each `.md` file in MEMORY_DIR (excluding MEMORY.md):

1. Read frontmatter between `---` markers
2. Extract `name`, `description`, `type` fields
3. Get file age from modification time: `stat -c %Y` or `date -r`
4. Format age as: `Xd` (days), `Xh` (hours), `Xm` (minutes)

Sort by type, then by age (newest first).

---

## Mode 2: Read

### `/memory read <name>`

Find file matching `<name>` (partial match OK):

```bash
ls "$MEMORY_DIR"/*<name>*.md | head -1
```

Display full content with frontmatter highlighted.

---

## Mode 3: Stats

### `/memory stats`

```
🧠 Memory Stats — [project name]

  Memories:    14 files
  Index:       MEMORY.md (60 lines)
  Total size:  12.4 KB
  Oldest:      9 days (reference_maw_cli.md)
  Newest:      2 days (feedback_never_push_main.md)

  By type:
    feedback   ████████████  5  (36%)
    reference  ████████      3  (21%)
    user       ████          1  (7%)
    project    ░░░░          0  (0%)

  Top keywords: oracle, push, maw, agent, fleet
```

### How to calculate

- Count files by type (from frontmatter)
- Sum file sizes
- Extract keywords: split all description fields into words, count frequency, show top 5

---

## Mode 4: Types

### `/memory types`

Group and display memories by type:

```
🧠 Memory Types

  📝 feedback (5)
    - never_push_main_skills — Always use branch + PR
    - talk_to_not_oracle_thread — Use /talk-to for threads
    - use_workon_skill — Use skill flow, don't edit directly
    - worktree_naming — worktree name = repo name
    - never_maw_done_without_approval — Ask before cleanup

  📚 reference (3)
    - maw_cli — maw hey, peek, ls commands
    - pulse_cli — board, timeline, scan
    - office_hash_routes — all views, deploy flow

  👤 user (1)
    - work_patterns — maker's schedule, peak hours

  📋 project (0)
    (none)
```

---

## Mode 5: Clean

### `/memory clean`

Find potentially stale memories:

1. Read each memory file
2. If `type: reference` and mentions file paths → check if files still exist
3. If `type: project` → check if still relevant (age > 30 days = likely stale)
4. Show candidates:

```
🧹 Memory Clean — candidates

  ⚠️  reference_office_hash_routes.md (9d)
      Mentions file paths — verify still current

  ✓  All other memories look current

  Run '/memory forget <name>' to remove a specific memory.
  Nothing is deleted without your confirmation.
```

**NEVER auto-delete.** Only suggest. User decides.

---

## Mode 6: Forget

### `/memory forget <name>`

1. Find the file
2. Show its content
3. Ask confirmation: "Remove this memory? (yes/no)"
4. If yes:
   - Delete the file
   - Remove its entry from MEMORY.md
   - Confirm: "Forgotten: <name>"
5. If no: "Kept: <name>"

---

## Cross-Project View

If user says `/memory scan --all` or `/memory stats --all`:

```bash
ls -d "$HOME/.claude/projects"/*/memory/ 2>/dev/null
```

Show memory counts per project:

```
🧠 All Projects

  Project                          Memories  Size
  ──────────────────────────────── ──────── ──────
  neo-oracle                       14        12.4KB
  oracle-skills-cli                 8         6.2KB
  maw-js                            5         3.1KB
  office-8bit                       3         2.0KB

  Total: 30 memories across 4 projects
```

---

ARGUMENTS: $ARGUMENTS
