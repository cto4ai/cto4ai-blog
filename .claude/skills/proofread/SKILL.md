---
name: proofread
description: Proofread blog posts for typos and wording improvements. Use when user asks to "proofread", "check for typos", "review wording", or "edit" MDX/MD files. Proposes changes one at a time for user approval.
---

# Proofreading Skill

Carefully review text for typos, grammatical errors, and opportunities for better wording. Propose changes one at a time.

## Workflow

1. Read the target file completely
2. Scan systematically for issues
3. Present ONE issue at a time with:
   - Line number and current text
   - Proposed change
   - Brief rationale
4. Wait for user approval (y/n) before proceeding
5. If approved, make the edit
6. Continue to next issue

## What to Look For

### Typos & Errors

- Misspellings (e.g., "definitively" when "definitely" is meant)
- Wrong words (e.g., "shell" vs "shill")
- Missing words (e.g., "as well ThursdAI's" → "as well as ThursdAI's")
- Broken/incomplete sentences
- Capitalization errors (e.g., "Agent Aanager" → "Agent Manager")

### Wording Improvements

- Awkward phrasing that could be clearer
- Overly complex sentences that could be simplified
- Weak word choices where stronger alternatives exist
- Redundant phrases

### Do NOT Flag

- Style preferences (Oxford comma, etc.) unless inconsistent
- Intentional informal language in quotes
- Technical terms that appear unusual but are correct
- Author's deliberate stylistic choices

## Interaction Format

**Present each issue as:**

```
**Line [N]:** "[current text snippet]"
**Proposed:** "[improved text]"
**Reason:** [brief explanation]

Approve? (y/n)
```

## Rules

- ONE change at a time - never batch multiple fixes
- Wait for explicit approval before editing
- If user provides different wording, use their version exactly
- Preserve all formatting, links, and component syntax
- Do not change quoted material (blockquotes) unless user requests
- Skip code blocks entirely
- Re-read the file if user indicates they made manual changes
