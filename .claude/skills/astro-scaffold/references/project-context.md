# cto4.ai Blog Project Context

cto4.ai-specific patterns, conventions, and architecture for the Astro-based blog.

## Content Type System

cto4.ai uses a unified content structure with 5 content types defined in frontmatter:

**Content Types** (`contentType` field):

- `essay` - Long-form articles (1000+ words)
- `brief` - Short-form content (under 1000 words)
- `elsewhere` - Curated external content with commentary
- `quote` - Quote posts with attribution
- `episode` - Podcast/video episode reviews

All content lives in `/src/data/content/{slug}/index.mdx` regardless of type.

## Directory Structure Convention

```
src/data/content/{slug}/
├── index.mdx                          # Main post file
├── transcripts/                       # AI conversation exports (TypeScript files)
├── embedded/                          # External Markdown files for embedding
└── socialposts/                       # Social media planning (NOT published)
    ├── images/
    ├── linkedin/post.txt
    ├── mastodon/post.txt
    └── twitter/thread.txt

Asset Storage (parallel slug-based structure):
src/assets/images/content/{slug}/      # Images - Astro-processed (responsive sizing, optimization)
public/videos/content/{slug}/          # Videos - Direct serving (no processing)
```

**Critical**:

- The `socialposts/` directory is for content planning only and is never published to the site
- Images and videos use parallel directory structures but different locations due to Astro's image processing capabilities

## Routing Architecture

### Permalink Pattern

**Pattern**: `/p/{slug}`
**Configuration**: `config.yaml` line 41: `permalink: '/p/%slug%'`

**How it works**:

1. Content collection reads from `/src/data/content/` ([src/utils/blog.ts:126](src/utils/blog.ts#L126))
2. `generatePermalink()` applies pattern ([src/utils/blog.ts:26](src/utils/blog.ts#L26))
3. Directory name becomes slug: `my-post/` → `/p/my-post`

### File Accessibility Rules

**Routable**: Only files in `/src/pages/` with extensions `.astro`, `.md`, `.mdx`, `.js`, `.ts` become URL routes.

**Not Routable**: Files in `/src/data/content/` are processed by the blog system and rendered at `/p/{slug}`, but are NOT directly accessible as URLs.

**Import Only**: Files can be imported from anywhere using static imports.

### Site Routes

- `/` - Homepage
- `/archive` - Full blog archive (preferred over `/blog`)
- `/search` - Pagefind search
- `/p/{slug}` - Individual posts
- `/tag/{tag}` - Tag archives
- `/category/{category}` - Category archives

## Frontmatter Schema

### Required Fields

```yaml
title: 'Post Title'
contentType: 'essay' # One of: essay, brief, elsewhere, quote, episode
description: 'SEO description'
author: 'Jack Ivers' # Always this value
publishDate: '2025-11-15T10:00:00-05:00' # ISO 8601 with timezone
draft: true # Always start true
```

### Optional Fields

```yaml
image: '~/assets/images/content/{slug}/cover.png'
featured: false
tags: ['tag1', 'tag2'] # 3-5 recommended
categories: ['category'] # Usually just one
```

### publishDate Convention

**cto4.ai-specific rule**: Set publishDate to **2 hours ago** (current time minus 2 hours).

- Format: ISO 8601 with timezone (`YYYY-MM-DDTHH:MM:SS-ZZ:ZZ`)
- Use shell `date` command to get current time
- Example: `2025-11-15T14:30:00-05:00` (Central Time)

## Component Import Patterns

**Root imports** (for components):

```jsx
import SingleImage from '~/components/ui/SingleImage.astro';
```

**Relative imports** (for post-local content):

```jsx
import { Content as Section } from './embedded/section.md';
import { conversation } from './transcripts/chat-export';
```

## Image Path Requirements

Images **must** be in `/src/assets/images/content/{slug}/` matching the post slug exactly.

**Example**: For post `my-post`, images go in `/src/assets/images/content/my-post/`

All image components require `postDir="{slug}"` parameter for correct path resolution.

## Deployment

- **Platform**: Cloudflare Pages
- **Triggers**: Auto-deploy on push to main; preview deploys for PRs
- **Tech notes**: GLightbox, Pagefind, View Transitions API all configured

## Named Entity Linking

Named entity linking is handled separately and is not part of initial post creation. See [.cursor/rules/named-entity-linking.mdc](.cursor/rules/named-entity-linking.mdc) for this workflow.
