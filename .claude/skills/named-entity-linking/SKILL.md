---
name: named-entity-linking
description: Add markdown links for named entities in blog posts. Use when user asks to "add links", "link entities", or "link names" in MDX/MD files (src/data/content/**/*.mdx). Requires browser-automation skill for link verification.
---

# Named Entity Linking

Add authoritative markdown links for named entities while preserving all other content.

## Workflow

1. Scan post for linkable entities
2. Web search for authoritative URLs
3. Verify with browser-automation (skip CF-blocked pages)
4. Link first occurrence only

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
