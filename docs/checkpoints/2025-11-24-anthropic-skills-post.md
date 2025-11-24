# Checkpoint: Anthropic Skills Post and CI Optimization

**Date:** 2025-11-24
**Status:** IN PROGRESS
**Branch:** main

## Objective

Create new blog post about Anthropic's "Stop Building Agents, Start Building Skills" talk from AI Engineer Code Summit, while also optimizing the GitHub Actions CI workflow and improving the astro-scaffold skill.

## Changes Made

### Modified Files

- `src/data/content/anthropic-stop-building-agents-start-building-skills/index.mdx` - New post with talk notes
- `.claude/skills/astro-scaffold/SKILL.md` - Improved frontmatter template
- `.github/workflows/actions.yaml` - Optimized from 4 jobs to 1

### Commits

- `3cd3238` - wip: Add Zhang & Murag talk notes to Anthropic skills post
- `4a725b9` - chore: Optimize CI workflow for faster builds
- `28fe134` - wip: Add Anthropic skills post scaffold and initial content
- `9951842` - chore: Improve astro-scaffold frontmatter template and format commands

## Key Technical Concepts

1. **Claude Code Skills vs MCP**: Skills provide instructions/prompts that tell Claude how to use existing tools (like Bash); MCP servers provide new tools directly
2. **browser-automation plugin**: Uses Stagehand CLI + Claude Agent SDK for browser automation, NOT MCP
3. **Astro frontmatter requirements**: Must include `title`, `contentType`, `description`, `author`, `publishDate`, `image`, `featured`, `featuredOrder`, `draft`, `tags`, `categories`
4. **CI optimization**: Consolidate parallel jobs that duplicate `npm ci` into sequential steps in one job

## Post Status

The post is currently in draft state with:

- Proper frontmatter (contentType: episode)
- Images directory created at `src/assets/images/content/anthropic-stop-building-agents-start-building-skills/`
- Detailed bullet-point notes from the Zhang & Murag talk covering:
  - Skills definition and architecture
  - Skills ecosystem (foundational, partner, enterprise)
  - Trends in skills development
  - Vision for evolving knowledge base
  - Agent stack comparison (Models=CPUs, Agents=OSs, Skills=Applications)

## Errors and Fixes

1. **Build failure due to wrong import paths**
   - Error: `Could not load ~/components/blog/SingleImage.astro`
   - Fix: Changed imports from `~/components/blog/` to `~/components/ui/`

2. **Skill template too prescriptive**
   - User feedback: "It is a bad practice to give EXACT details that the agent can figure out itself"
   - Fix: Changed skill to just list component names, let agent find paths

3. **Prettier blocking push**
   - Fix: Ran `npm run fix:prettier`

## Next Steps

1. Convert raw notes to polished prose (user task)
2. Add header image to frontmatter
3. Set `draft: false` and publish when ready
