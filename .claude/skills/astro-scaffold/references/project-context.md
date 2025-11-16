# cto4.ai Blog Project Context

Project-specific architecture, patterns, and conventions for the cto4.ai Astro-based blog.

## Project Overview

**cto4.ai** is an Astro-based blog migrated from the Hugo-based craftycto blog. This is the future home of blog content, while the corporate site remains at craftycto.com.

**Key Technologies**:

- Astro v5.13 - Static site generator with MDX support
- Tailwind CSS v3.4 - Utility-first CSS framework
- TypeScript - Type-safe development
- Pagefind - Client-side search
- GLightbox - Lightbox for image galleries

## Content Structure

### Unified Directory Organization

All content uses a unified directory structure with content types defined in frontmatter:

**Content Location**: `/src/data/content/{slug}/index.mdx`

**Content Types** (defined in frontmatter `contentType` field):

- `essay` - Long-form articles (1000+ words)
- `brief` - Short-form content (under 1000 words)
- `elsewhere` - Curated external content
- `quote` - Quote posts
- `episode` - Podcast/video reviews

### Directory Structure

```
src/data/content/{slug}/
├── index.mdx                          # Main post file
├── transcripts/                       # AI conversation exports (TypeScript)
├── embedded/                          # External Markdown files for embedding
└── socialposts/                       # Social media content planning
    ├── images/                        # Social-specific images
    ├── linkedin/
    │   └── post.txt
    ├── mastodon/
    │   └── post.txt
    └── twitter/
        └── thread.txt

src/assets/images/content/{slug}/      # All images for the post
```

**Important**: The `socialposts/` directory is for content planning only and will NOT be published.

## Routing Architecture

### Blog Post URL Generation

**Pattern**: `/p/{slug}` (defined in `config.yaml` line 41: `permalink: '/p/%slug%'`)

**Processing Flow**:

1. Content collection system reads from `/src/data/content/` ([src/utils/blog.ts:126](src/utils/blog.ts#L126))
2. `generatePermalink()` applies `POST_PERMALINK_PATTERN` to create URLs ([src/utils/blog.ts:26](src/utils/blog.ts#L26))
3. Directory name becomes the slug (e.g., `pydantic-ai-reaches-v1/` → `/p/pydantic-ai-reaches-v1`)

### File Accessibility Rules

- **Routable Files**: Only files in `/src/pages/` with extensions `.astro`, `.md`, `.mdx`, `.js`, `.ts`
- **Content Files**: `/src/data/content/**/*` are processed by blog system, NOT directly accessible as URLs
- **Static Imports**: Files anywhere can be imported as content
- **Blog Routes**: `/src/pages/[...blog]/` files redirect to `/archive`

### Important Routes

- `/` - Homepage with latest posts
- `/archive` - Full blog archive (preferred over `/blog`)
- `/search` - Pagefind-powered search
- `/p/{slug}` - Individual blog posts
- `/tag/{tag}` - Posts by tag
- `/category/{category}` - Posts by category

## Frontmatter Requirements

### Required Fields

```yaml
title: 'Your Post Title Here'
contentType: 'essay'
description: 'Brief description for SEO and social sharing'
author: 'Jack Ivers'
publishDate: '2025-11-15T10:00:00-05:00'
draft: true
```

### Optional Fields

```yaml
image: '~/assets/images/content/{slug}/cover-image.png'
featured: false
tags: ['tag1', 'tag2']
categories: ['category1']
```

### Date Format

- Use ISO 8601: `YYYY-MM-DDTHH:MM:SS-ZZ:ZZ`
- Example: `2025-11-15T14:30:00-05:00` (Central Time)
- Always include timezone offset
- **At creation**: Use shell `date` command to get current time, then set to **2 hours ago**

## Development Commands

### Start Development Server

```bash
npm run dev
```

Starts Astro dev server with hot reload on port 4321.

### Build for Production

```bash
npm run build
```

Builds the site for production deployment.

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally.

### Quality Checks

```bash
npm run check       # Run all checks (TypeScript, ESLint, Prettier)
npm run fix:prettier # Auto-fix formatting issues
```

## CI/CD Requirements

**Pre-push hooks** are configured to prevent CI failures:

1. `npm run check` - Runs TypeScript, ESLint, Prettier validation
2. `npm run build` - Ensures the site builds successfully

### Common CI Failure Causes

- TypeScript errors (missing types, wrong properties)
- ESLint errors (`no-explicit-any`, unused variables)
- Prettier formatting inconsistencies
- Build errors (missing images, broken imports)

## Draft Management

- Set `draft: true` while writing
- Test with `npm run dev` before publishing
- Change to `draft: false` only when ready to publish
- Drafts won't appear in production builds

## SEO & Social Sharing

- **Title**: 60 characters or less ideal
- **Description**: 155 characters or less
- **Tags**: 3-5 per post
- **Categories**: Usually just one
- **Cover Image**: 1200x628px minimum for social sharing

## Migration Context

This repository is part of a dual-repository setup:

1. **craftycto** (Hugo) - Original blog at craftycto.com/blog
2. **cto4ai-blog** (Astro) - New blog at cto4.ai (this repo)

The Hugo blog remains operational while content is being migrated.

## Deployment

- Deployed to Cloudflare Pages
- Automatic deployment on push to main branch
- Preview deployments for pull requests
- GLightbox requires proper initialization for client-side navigation
- Pagefind search index generated during build
- Site uses View Transitions API for smooth navigation

## Best Practices

### Images

- Always provide alt text for accessibility
- Use descriptive filenames
- Optimize before upload
- Cover image: 1200x628px minimum
- Place in `/src/assets/images/content/{slug}/`
- Use `postDir` parameter matching slug

### Content Organization

- Start with compelling introduction
- Use headers (##, ###) for structure
- Break up long text with images, lists, or quotes
- End with clear conclusion or call-to-action

### Named Entity Linking

- Not part of initial creation
- See separate rule [.cursor/rules/named-entity-linking.mdc](.cursor/rules/named-entity-linking.mdc)

### Component Imports

- Always import required components at top of MDX file
- Use `~/` prefix for root imports
- Use relative paths (e.g., `./embedded/file.md`) for post-local files

### Testing

- Always verify changes with dev server before committing
- Check both light and dark modes when possible
- Test navigation and interactive elements
- Ensure search functionality remains intact
- Use Playwright MCP for browser testing when available

## Key Custom Components

### Layout Components

- **SinglePost.astro**: Main blog post layout with header image
- **GridItem.astro**: Blog post cards with 44:28 aspect ratio
- **RelatedPosts.astro**: Shows related posts based on tags/categories

### Image Components

- **SingleImage**: Display single images with lightbox
- **ImageGallery**: Display multiple images in grid with lightbox

### Content Components

- **ChatTranscript**: Display AI conversation transcripts
- **MDContent**: Embed external Markdown files with styled sections
