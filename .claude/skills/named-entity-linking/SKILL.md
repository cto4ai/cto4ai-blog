---
name: named-entity-linking
description: Add markdown links for named entities in blog posts. Use when user asks to "add links", "link entities", or "link names" in MDX/MD files (src/data/content/**/*.mdx). Requires browser-automation skill for link verification.
---

# Named Entity Linking

Add authoritative markdown links for named entities while preserving all other content.

## Workflow

1. **Self-link first**: Check for references to other blog posts (see Self-Linking below)
2. Scan post for linkable external entities
3. Web search for authoritative URLs
4. Verify with browser-automation (skip CF-blocked pages)
5. Link first occurrence only

## Self-Linking (Internal References)

Before external linking, check if the post references other posts on this blog.

### How to Find Matches

1. Scan `src/data/content/*/index.mdx` frontmatter to build slug → title lookup
2. Look for text that references other posts:
   - Topic keywords matching post titles (e.g., "Skills", "Shape Up", "Antigravity")
   - Phrases like "here", "my recent post", "I wrote about" near a topic
   - Shortened title references

### Link Format

Use relative slug: `[text](post-slug)` — no `/p/` prefix needed.

Example: `[here](cursor-rules-to-claude-skills)`

### Rules

- Only link when confident the reference matches
- Ask user if ambiguous: "Did you mean to link to [Post Title]?"
- Skip self-references to the current post

## Entity Selection

See [references/entity-examples.md](references/entity-examples.md) for what to link and skip.

## Link Strategy

Find AN authoritative reference (not THE most authoritative):

- Official pages, docs, Wikipedia, announcement blogs
- Avoid: login pages, paywalls, redirects

Use placeholder `#` if no authoritative source found.

## Verification

Use browser-automation to confirm links load. Mark CF-blocked URLs as "UNRESOLVED (CF gate)" and continue.

For LinkedIn profiles, confirm the person matches expected context (AI industry, company affiliation).

## Rules

- ONLY modify links - preserve all content exactly
- Link first occurrence only
- Use exact term user specifies (not variations like "X mode")
- Use exact URL if user provides one
