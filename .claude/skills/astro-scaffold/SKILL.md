---
name: astro-scaffold
description: Technical scaffolding for cto4.ai Astro blog posts. This skill should be used when creating new blog posts, setting up post directory structures, adding technical components (images, galleries, chat transcripts, embedded content), or configuring post frontmatter and imports.
---

# Astro Blog Post Scaffolding

This skill provides technical scaffolding for creating and constructing blog posts on the cto4.ai Astro-based blog.

## Purpose

- Scaffold new blog post directory structures
- Set up proper frontmatter and component imports
- Add technical components (images, galleries, chat transcripts, embedded content)
- Configure post metadata and assets

**Important**: This skill handles technical scaffolding and construction. Content writing is done by the user.

## Creating a New Post

### 1. Determine the Slug

Pick a URL-friendly slug based on the post title:
- Keep the slug a reasonable size
- Use lowercase with hyphens
- Example: "migrating-cursor-rules-to-claude-skills"

### 2. Create Directory Structure

For a post with slug `{slug}`:

```bash
# Create content directory and file
mkdir -p src/data/content/{slug}
touch src/data/content/{slug}/index.mdx

# Create parallel images directory
mkdir -p src/assets/images/content/{slug}

# Create transcripts directory for AI conversation exports
mkdir -p src/data/content/{slug}/transcripts

# Create embedded directory for external Markdown files
mkdir -p src/data/content/{slug}/embedded

# Create social media scaffolding
mkdir -p src/data/content/{slug}/socialposts/images
mkdir -p src/data/content/{slug}/socialposts/linkedin
mkdir -p src/data/content/{slug}/socialposts/mastodon
mkdir -p src/data/content/{slug}/socialposts/twitter
touch src/data/content/{slug}/socialposts/linkedin/post.txt
touch src/data/content/{slug}/socialposts/mastodon/post.txt
touch src/data/content/{slug}/socialposts/twitter/thread.txt
```

### 3. Initialize index.mdx

Create `src/data/content/{slug}/index.mdx` with:

```mdx
---
title: "Post Title Here"
contentType: "essay"
description: "Brief description for SEO and social sharing"
author: "Jack Ivers"
publishDate: "YYYY-MM-DDTHH:MM:SS-05:00"
image: "~/assets/images/content/{slug}/cover-image.png"
featured: false
draft: true
tags: ["tag1", "tag2"]
categories: ["category1"]
---

import SingleImage from '~/components/ui/SingleImage.astro';
import ImageGallery from '~/components/ui/ImageGallery.astro';
import ChatTranscript from '~/components/ui/ChatTranscript.astro';
import MDContent from '~/components/ui/MDContent.astro';

Content starts here...
```

### 4. Set the Publish Date

**Important**: Use the shell `date` command to get the current date-time, then set `publishDate` to **2 hours ago** (current time minus 2 hours).

Format: ISO 8601 with timezone
- Example: `2025-11-15T18:30:00-05:00` (Central Time)

### 5. Choose Content Type

Set `contentType` to one of:
- `essay` - Long-form articles (1000+ words)
- `brief` - Short-form content (under 1000 words)
- `elsewhere` - Curated external content with commentary
- `quote` - Quote posts with attribution
- `episode` - Podcast or video episode commentary

### 6. Set Draft Status

**Always** set `draft: true` for new posts. Change to `draft: false` only when ready to publish.

## Adding Components

For detailed component usage, see `references/components-reference.md`.

### Quick Reference

**Single Image**:
```jsx
<SingleImage
  src="image.png"
  alt="Description"
  size="2xl"
  postDir="{slug}"
/>
```

**Image Gallery**:
```jsx
<ImageGallery
  images={["img1.png", "img2.png"]}
  postDir="{slug}"
  size="xl"
/>
```

**Chat Transcript**:
```jsx
import { conversation } from './transcripts/chat-export';

<ChatTranscript
  transcript={conversation}
  theme="adium"
  maxHeight="600px"
/>
```

**Embedded Markdown**:
```jsx
import { Content as Section } from './embedded/section.md';

<MDContent
  title="Section Title"
  Content={Section}
/>
```

## Image Storage

- **Location**: `/src/assets/images/content/{slug}/`
- **Must match post slug**: Images for `my-post` go in `/src/assets/images/content/my-post/`
- **Formats**: `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`
- **Cover image**: Minimum 1200x628px for social sharing

## Important Notes

- All images must be in the directory matching the post's slug
- Use `postDir` parameter matching the post slug exactly
- The `socialposts/` directory is for planning only - not published
- Content files in `/src/data/content/` are processed by the blog system and rendered at `/p/{slug}`
- Only files in `/src/pages/` become directly routable pages

## Additional Resources

- **Component details**: See `references/components-reference.md`
- **Project context**: See `references/project-context.md`

## Testing

Always test with the dev server before publishing:
```bash
npm run dev
```

Visit http://localhost:4321/p/{slug} to preview the post.
