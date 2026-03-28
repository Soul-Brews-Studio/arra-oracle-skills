---
name: skill-review
description: "Score skills using the Oracle Skill Matrix — 6 dimensions (Activation, Clarity, Resilience, Disclosure, Alignment, Completeness). Use when user says 'skill review', 'score skills', 'skill matrix', 'review skills', 'skill quality'. Do NOT trigger for skill creation (use /create-shortcut), skill installation (use /go), or skill listing (use /xray --skills)."
argument-hint: "[skill-name | --all | --bottom-5]"
---

# /skill-review — Oracle Skill Matrix

Score skills on 6 dimensions. Our own quality system — no external dependencies.

## Usage

```
/skill-review              # Review all installed skills
/skill-review awaken       # Score a single skill
/skill-review --bottom-5   # Show 5 lowest-scoring skills
```

## The 6 Dimensions (0-10 each, max 60)

### 1. ACT — Activation (trigger accuracy)
| Criteria | Points |
|----------|--------|
| 5+ trigger phrases in description | +2 |
| "Do NOT trigger for..." clauses | +3 |
| Specific enough to avoid false triggers | +3 |
| argument-hint exists | +2 |

### 2. CLR — Clarity (can any AI follow this?)
| Criteria | Points |
|----------|--------|
| Numbered steps | +3 |
| Bash code blocks with real paths | +3 |
| Decision tables for modes/options | +2 |
| No ambiguous language ("maybe", "consider") | +2 |

### 3. RES — Resilience (error handling)
| Criteria | Points |
|----------|--------|
| Documents what happens when tools fail | +3 |
| Has fallback paths | +3 |
| Handles missing prerequisites | +2 |
| Silent vs loud failure documented | +2 |

### 4. DIS — Disclosure (information architecture)
| Criteria | Points |
|----------|--------|
| Top-to-bottom flow (quick → deep) | +3 |
| Multiple modes with clear entry points | +3 |
| Right-sized (not bloated, not skeletal) | +2 |
| references/ for long content | +2 |

### 5. ALN — Alignment (Oracle philosophy)
| Criteria | Points |
|----------|--------|
| References or embeds principles | +3 |
| Bilingual (Thai/English) elements | +2 |
| arra_learn/arra_trace integration | +2 |
| Rule 6 attribution where appropriate | +1 |
| Nothing is Deleted pattern | +2 |

### 6. CMP — Completeness (covers the job)
| Criteria | Points |
|----------|--------|
| Answers WHAT + WHEN + HOW | +3 |
| All flags/modes documented | +3 |
| Output format specified | +2 |
| Edge cases addressed | +2 |

## Grades

| Score | Grade | Meaning |
|-------|-------|---------|
| 50-60 | A | Exemplary — reference quality |
| 40-49 | B | Solid — minor improvements possible |
| 30-39 | C | Functional — needs attention |
| 20-29 | D | Weak — significant work needed |
| <20 | F | Stub — rewrite or absorb |

## Steps

### 1. Find skills to review

```bash
SKILLS_DIR="$HOME/.claude/skills"
# Or from repo source:
# SKILLS_DIR="src/skills"
```

If argument is a skill name, review only that skill.
If `--all` or no argument, review all skills.
If `--bottom-5`, review all then show only the 5 lowest.

### 2. For each skill, read SKILL.md

Read the full content. Score each dimension 0-10 based on the criteria tables above.

### 3. Output scorecard

**Single skill:**

```
## Skill Review: /[name]

| Dimension | Score | Notes |
|-----------|-------|-------|
| ACT | X/10 | [brief note] |
| CLR | X/10 | [brief note] |
| RES | X/10 | [brief note] |
| DIS | X/10 | [brief note] |
| ALN | X/10 | [brief note] |
| CMP | X/10 | [brief note] |
| **Total** | **X/60** | **Grade: X** |

### Suggestions
- [actionable improvement 1]
- [actionable improvement 2]
```

**All skills:**

```
| Skill | ACT | CLR | RES | DIS | ALN | CMP | Total | Grade |
|-------|-----|-----|-----|-----|-----|-----|-------|-------|
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

### Weakest Dimensions (fleet-wide)
1. [dimension] — avg X/10
2. [dimension] — avg X/10

### Bottom 5
1. [skill] — [score] — [primary weakness]
```

### 4. Save to vault (optional)

```bash
PSI=$(readlink -f ψ 2>/dev/null || echo "ψ")
mkdir -p "$PSI/memory/learnings"
```

Write review to `$PSI/memory/learnings/YYYY-MM-DD_skill-review.md`

## Philosophy

> "Patterns Over Intentions" — we score what the skill DOES, not what it claims.

The matrix measures observable quality markers. A skill that claims to be comprehensive but lacks error handling scores low on RES. A skill with beautiful prose but no numbered steps scores low on CLR.

Score what you see, not what you imagine.

ARGUMENTS: $ARGUMENTS
