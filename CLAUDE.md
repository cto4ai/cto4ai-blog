# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "CTO4.AI" - a new Astro-based blog being migrated from the Hugo-based CraftyCTO blog. This repository represents the future home of the blog content, while the corporate site will remain at craftycto.com. The blog uses AstroWind theme as its foundation and is deployed to cto4.ai domain.

## Core Technologies

- **Astro v5.13**: Static site generator with MDX support
- **Tailwind CSS v3.4**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **Pagefind**: Client-side search functionality
- **GLightbox**: Lightbox for image galleries
- **Vite**: Build tool and dev server

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts the Astro development server with hot reload on port 4321.

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

### Other Commands
```bash
npm run check        # Check Astro configuration
npm run format       # Format code with Prettier
```

## Content Structure (Unified - Option 2A Implemented)

### Content Organization
All content now uses a unified directory structure with content types defined in frontmatter:
- **All Content**: `/src/data/content/[slug]/index.mdx` - All content types in unified structure
- **Content Types** (defined in frontmatter `contentType` field):
  - `essay` - Long-form articles (previously in /posts/)
  - `brief` - Short-form content (previously in /micro/)
  - `elsewhere` - Curated external content
  - `quote` - Quote posts
  - `episodes` - Podcast/video reviews (new type)

### Images
- **All Images**: `/src/assets/images/content/[slug]/` - Unified image storage
- Each post's images are stored in a directory matching its slug
- Components automatically look in the correct location based on postDir

## Key Custom Components

### Image Components
- **SingleImage**: Display single images with lightbox support
  - Usage: `<SingleImage src="image.png" alt="Description" size="2xl" postDir="post-name" />`
- **ImageGallery**: Display multiple images in a grid with lightbox
  - Usage: `<ImageGallery images={["img1.png", "img2.png"]} postDir="post-name" size="xl" />`

### Layout Components
- **SinglePost.astro**: Main blog post layout with header image
- **GridItem.astro**: Blog post cards with 44:28 aspect ratio
- **RelatedPosts.astro**: Shows related posts based on tags/categories

## Important Routes

- `/` - Homepage with latest posts
- `/archive` - Full blog archive (preferred over /blog)
- `/search` - Pagefind-powered search
- `/p/[slug]` - Individual blog posts
- `/tag/[tag]` - Posts by tag
- `/category/[category]` - Posts by category

## Migration Context

This repository is part of a dual-repository setup:
1. **craftycto** (Hugo) - Original blog at craftycto.com/blog
2. **cto4ai-blog** (Astro) - New blog at cto4.ai (this repo)

The migration is happening in parallel - the Hugo blog remains operational while content is being migrated here.

## Development Guidelines

### When Working with Content
- **NEVER** overwrite existing MDX files without explicit user permission
- Always check if a file exists before migrating content
- Preserve all frontmatter when editing posts
- Images from Hugo should come from source directories, not `_gen` folders

### Image Handling
- Use Astro's Image component for optimization
- Standard aspect ratio is 44:28 for consistency
- Always provide alt text for accessibility
- Place images in `/src/assets/images/content/[slug]/` matching the post's slug

### Component Usage
- Prefer editing existing components over creating new ones
- Follow existing patterns in the codebase
- Use Tailwind classes for styling
- Maintain dark mode compatibility

### Testing
- Always verify changes with Playwright when available
- Check both light and dark modes
- Test navigation and interactive elements
- Ensure search functionality remains intact

## Migration Scripts

Several Python scripts assist with content migration:
- `complete-conversion.py` - Full content migration
- `convert-hugo-shortcodes.py` - Convert Hugo shortcodes to MDX
- `patch-existing-mdx.py` - Update existing MDX files
- `migrate_micro_content.py` - Migrate micro posts

## Deployment

The site automatically deploys to production when pushing to the main branch. Preview deployments are created for pull requests.

## Important Notes

- The `/blog` route is considered obsolete - use `/archive` instead
- GLightbox requires proper initialization for client-side navigation
- Pagefind search index is generated during build
- The site uses View Transitions API for smooth navigation
- Always run the dev server to test changes before committing
- remember you have access to Playwright MCP for browser access e.g. to dev server
- this site will be deployed to Cloudflare Pages