---
name: astro-scaffold
description: Technical scaffolding for cto4.ai Astro blog posts. This skill should be used when creating new blog posts, setting up post directory structures, adding technical components (images, galleries, chat transcripts, embedded content), or configuring post frontmatter and imports.
---

# Astro Blog Post Scaffolding

## Purpose

This skill provides technical scaffolding and construction guidance for the cto4.ai Astro-based blog. It handles directory setup, frontmatter configuration, and technical component integration. **Important**: This skill is for technical scaffolding only—content writing is done by the user.

## When to Use This Skill

Use this skill when:

- Creating a new blog post and need to scaffold the directory structure
- Adding technical components (SingleImage, ImageGallery, ChatTranscript, MDContent) to posts
- Setting up post frontmatter with proper cto4.ai-specific conventions
- Working with the unified content structure (essay/brief/elsewhere/quote/episode content types)

## How to Use This Skill

### Scaffolding a New Post

1. **Determine the slug** from the post title (lowercase, hyphens, reasonable length)

2. **Create the directory structure** for `src/data/content/{slug}/`:
   - `index.mdx` (main post file)
   - `transcripts/` (for AI conversation exports as TypeScript files)
   - `embedded/` (for external Markdown files to embed)
   - `socialposts/` (LinkedIn, Twitter, Mastodon planning - not published)
   - Parallel asset directories:
     - `src/assets/images/content/{slug}/` (images - Astro-processed)
     - `public/videos/content/{slug}/` (videos - direct serving)

3. **Initialize frontmatter** in `index.mdx` with cto4.ai-specific conventions:
   - `contentType`: One of `essay`, `brief`, `elsewhere`, `quote`, `episode`
   - `publishDate`: **Critical** - Set to 2 hours ago (current time minus 2 hours) in ISO 8601 format with timezone
   - `author`: "Jack Ivers"
   - `draft: true` (always start as draft)
   - Standard imports: SingleImage, ImageGallery, ChatTranscript, MDContent

4. **Images must be in** `/src/assets/images/content/{slug}/` matching the post slug exactly—use `postDir="{slug}"` parameter in all image components

### Adding Components

When adding technical components to posts, consult `references/components-reference.md` for:

- SingleImage, ImageGallery usage and parameters
- ChatTranscript integration (requires TypeScript transcript files)
- MDContent for embedding external Markdown sections
- Image path resolution and troubleshooting

### Project-Specific Patterns

For cto4.ai-specific routing, content types, and conventions, reference `references/project-context.md`:

- Unified content structure and permalink patterns (`/p/{slug}`)
- File accessibility rules (content vs pages)
- Frontmatter requirements and date formatting
- socialposts directory conventions

### Key Non-Obvious Patterns

- **publishDate convention**: Always set to 2 hours ago using shell `date` command
- **Asset paths**: Parallel slug-based structure for all assets
  - Images: `src/assets/images/content/{slug}/` (Astro-processed for responsive sizing)
  - Videos: `public/videos/content/{slug}/` (direct serving, no processing)
- **Component imports**: Use `~/` prefix for components, relative paths (`./`) for embedded content
- **socialposts directory**: For planning only, never published
- **Content routing**: Files in `/src/data/content/` become `/p/{slug}`, NOT directly routable

## Testing

Test with `npm run dev` and visit `http://localhost:4321/p/{slug}` before publishing.
