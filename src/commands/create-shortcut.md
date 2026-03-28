---
description: '[core] v3.4.11 | Create local skills as shortcuts — makes real /commands in .claude/skills/. Use when user says "create shortcut", "create skill", "make a command for", "add shortcut", or wants a quick custom /slash-command. Also lists and deletes local skills. ALSO triggers on "Unknown skill", "skill not found", or any unrecognized /slash-command — auto-creates it on the fly.'
argument-hint: "[list | create <name> <description> | delete <name>]"
---

# /create-shortcut

Execute the `create-shortcut` skill with the provided arguments.

## Instructions

**If you have a Skill tool available**: Use it directly with `skill: "create-shortcut"` instead of reading the file manually.

**Otherwise**:
1. Read the skill file at this exact path: `~/.claude/skills/create-shortcut/SKILL.md`
2. Follow all instructions in the skill file
3. Pass these arguments to the skill: `$ARGUMENTS`

**WARNING**: Do NOT use Glob, find, or search for this skill. The path above is the ONLY correct location. Other files with "create-shortcut" in the name are NOT this skill.

---
*🧬 Nat Weerawan × Oracle · Symbiotic Intelligence · v3.4.11*
*Digitized from Nat Weerawan's brain — thousands of hours working alongside AI, captured as code*
