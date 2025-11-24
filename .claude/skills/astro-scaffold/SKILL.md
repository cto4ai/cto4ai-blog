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
     - Create subdirectories: `linkedin/`, `twitter/`, `mastodon/`, `images/`
     - Add `.gitkeep` to empty directories (especially `images/`) to preserve structure in Git
   - Parallel asset directories:
     - `src/assets/images/content/{slug}/` (images - Astro-processed)
     - `public/videos/content/{slug}/` (videos - direct serving)

3. **Initialize frontmatter** in `index.mdx` using this exact template:

   ```yaml
   ---
   title: '{Post Title}'
   contentType: 'essay'  # One of: essay, brief, elsewhere, quote, episode
   description: ''  # Leave empty for user to fill
   author: 'Jack Ivers'
   publishDate: '{ISO 8601 timestamp 2 hours ago}'  # Use: date -v-2H +%Y-%m-%dT%H:%M:%S%z
   image: '~/assets/images/content/{slug}/'  # Path to header image, leave filename empty
   featured: false
   featuredOrder: 10
   draft: true
   tags: []
   categories: []
   ---
   ```

   **Content-type specific fields:**
   - For `elsewhere` type, add: `sourceLink: ''` (URL to original content)

   **After frontmatter, add standard imports:**
   ```mdx
   import SingleImage from '~/components/blog/SingleImage.astro';
   import ImageGallery from '~/components/blog/ImageGallery.astro';
   import ChatTranscript from '~/components/blog/ChatTranscript.astro';
   import { Content as MDContent } from '~/components/blog/MDContent.astro';
   ```

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
- **`.gitkeep` files**: Added to empty directories to preserve scaffold structure in Git (Git only tracks files, not empty directories)

## Testing

Test with `npm run dev` and visit `http://localhost:4321/p/{slug}` before publishing.
