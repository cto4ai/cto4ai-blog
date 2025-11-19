# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "CTO4.AI" - an Astro-based blog deployed to cto4.ai domain. The blog uses the AstroWind theme as its foundation.

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
npm run check           # Run all checks (TypeScript, ESLint, Prettier)
npm run fix:prettier    # Auto-fix formatting issues with Prettier
```

## Content Structure

### Content Organization

All content now uses a unified directory structure with content types defined in frontmatter:

- **All Content**: `/src/data/content/[slug]/index.mdx` - All content types in unified structure
- **Content Types** (defined in frontmatter `contentType` field):
  - `essay` - Long-form articles
  - `brief` - Short-form content
  - `elsewhere` - Curated external content
  - `quote` - Quote posts
  - `episodes` - Podcast/video reviews

### Images

- **All Images**: `/src/assets/images/content/[slug]/` - Unified image storage
- Each post's images are stored in a directory matching its slug
- Components automatically look in the correct location based on postDir

### Directory Structure Preservation

This repository uses `.gitkeep` files to preserve empty directory structures in Git. Since Git only tracks files (not empty directories), adding a `.gitkeep` file ensures the directory exists when cloning the repository.

**When scaffolding new posts**, the astro-scaffold skill automatically creates `.gitkeep` files in empty directories, particularly:

- `socialposts/images/.gitkeep` - Preserves the images directory for social media assets
- Other empty scaffold directories as needed

**Why this matters**: Without `.gitkeep` files, empty directories disappear from Git, resulting in incomplete scaffold structure when cloning on new machines or for team members.

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

## Routing Architecture

### Blog Post URL Generation

- **Pattern**: `/p/%slug%` (defined in `config.yaml` line 41: `permalink: '/p/%slug%'`)
- **Content Location**: `/src/data/content/[slug]/index.mdx`
- **Processing Flow**:
  1. Content collection system reads from `/src/data/content/` (`src/utils/blog.ts:126`)
  2. `generatePermalink()` applies `POST_PERMALINK_PATTERN` to create URLs (`src/utils/blog.ts:26`)
  3. Directory name becomes the slug (e.g., `pydantic-ai-reaches-v1/` → `/p/pydantic-ai-reaches-v1`)

### File Accessibility Rules

- **Routable Files**: Only files in `/src/pages/` with extensions `.astro`, `.md`, `.mdx`, `.js`, `.ts`
- **Content Files**: `/src/data/content/**/*` are processed by blog system, NOT directly accessible as URLs
- **Static Imports**: Files anywhere can be imported as content (e.g., `/src/privacy-policy.md`)
- **Blog Routes**: `/src/pages/[...blog]/` files redirect to `/archive` - individual posts rendered via content collection

### MD File Embedding Options

1. **Direct Import** (recommended for post-specific files):
   ```js
   import { Content as Part1 } from './pydantic_ai_part_1.md';
   ```
2. **Root Import** (for site-wide content):
   ```js
   import { Content as Privacy } from '~/privacy-policy.md';
   ```
3. **Separate Pages** (for standalone URLs):
   - Create files in `/src/pages/` to make them directly accessible
4. **Custom Components** (for styled embedding):
   - Create reusable components that import and style MD content

### Content Collection Processing

- Unified content structure with `contentType` field in frontmatter
- All content types (essay, brief, elsewhere, quote, episodes) processed identically
- Permalinks generated via `POST_PERMALINK_PATTERN` replacement
- Draft filtering based on environment (`SHOW_DRAFTS` in development)

## Development Guidelines

### When Working with Content

- **NEVER** overwrite existing MDX files without explicit user permission
- Always check if a file exists before creating content
- Preserve all frontmatter when editing posts

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

## CI Requirements - MUST READ

**IMPORTANT: Pre-push hooks are configured to prevent CI failures**

The repository uses git hooks to ensure code quality before pushing to GitHub. A pre-push hook automatically runs these checks:

### Checks Run Before Push

1. **`npm run check`** - Runs all validation:
   - `astro check` - TypeScript and Astro component validation
   - `eslint` - Code quality and style rules
   - `prettier --check` - Code formatting validation

2. **`npm run build`** - Ensures the site builds successfully

### Common CI Failure Causes

- **TypeScript errors**: Missing types, wrong property names, non-existent properties
  - Example: Using `post.data.date` when only `post.data.publishDate` exists
- **ESLint errors**: `no-explicit-any`, unused variables
  - Fix: Use proper types or add ESLint disable comments when necessary
- **Component type errors**: Invalid component types in Astro
  - Fix: Use `any` with ESLint disable for dynamic components
- **Prettier formatting**: Inconsistent formatting
  - Fix: Run `npm run fix:prettier` to auto-format
- **Build errors**: Missing images, broken imports
  - Fix: Verify all imports and file paths

### Manual Testing

If you need to run checks manually:

```bash
npm run check       # Run all checks (TypeScript, ESLint, Prettier)
npm run build       # Test the build
npm run fix:prettier # Auto-fix formatting issues
```

### If Push is Blocked

If the pre-push hook blocks your push:

1. Read the error message carefully
2. Fix the reported issues
3. Run `npm run check` locally to verify fixes
4. Try pushing again

The pre-push hook ensures CI will pass on GitHub, preventing regression failures.

## Additional Notes

- save our work means add,commit,push
