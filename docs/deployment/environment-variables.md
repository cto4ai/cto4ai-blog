# Environment Variables Configuration

## Overview

This document describes the environment variables used in the CTO4.AI blog application, particularly for managing draft content visibility across different deployment environments.

## Draft Content Management

### `PUBLIC_SHOW_DRAFTS_IN_PREVIEW`

**Purpose:** Controls the visibility of draft posts in preview deployments.

**Type:** String

**Values:**
- `"true"` - Show draft posts in preview deployments
- `undefined` or any other value - Hide draft posts

**Default Behavior:**
- **Development Mode (`npm run dev`):** Draft posts are always visible
- **Production Build (`npm run build`):** Draft posts are always hidden unless this variable is set
- **Preview Deployments:** Draft posts are hidden by default, visible when set to `"true"`

## Cloudflare Pages Configuration

### Setting Environment Variables

1. **Production Branch (main):**
   - No environment variables needed for draft management
   - Draft posts are automatically hidden in production builds

2. **Preview Branches:**
   - Navigate to your Cloudflare Pages project settings
   - Go to **Settings** → **Environment variables**
   - Add a new variable:
     ```
     Variable name: PUBLIC_SHOW_DRAFTS_IN_PREVIEW
     Value: true
     Environment: Preview
     ```

### Build Configuration

Ensure your Cloudflare Pages project has the following build settings:

```yaml
Build command: npm run build
Build output directory: /dist
Node version: 20.11.0
```

The Node version is specified in the `.nvmrc` file and will be automatically detected by Cloudflare Pages.

## Security Considerations

### Preview URLs

- **Default Access:** Cloudflare Pages preview URLs are publicly accessible by default
- **Pattern:** `https://[branch-name].[project-name].pages.dev`

### Recommendations for Sensitive Content

If your draft posts contain sensitive information:

1. **Option 1: Don't Enable Draft Visibility**
   - Keep `PUBLIC_SHOW_DRAFTS_IN_PREVIEW` unset for preview branches
   - Test draft content only in local development

2. **Option 2: Use Cloudflare Access**
   - Configure Cloudflare Access to protect preview URLs
   - Require authentication to view preview deployments
   - Steps:
     1. Go to Cloudflare Zero Trust dashboard
     2. Create an Access application for `*.cto4ai.pages.dev`
     3. Set authentication requirements (e.g., email domain, specific users)

## Environment Detection in Code

The application uses Astro's built-in environment detection:

```typescript
// Determine if drafts should be shown
const SHOW_DRAFTS = import.meta.env.DEV || 
                    import.meta.env.PUBLIC_SHOW_DRAFTS_IN_PREVIEW === "true";
```

### Available Environment Flags

- `import.meta.env.DEV` - `true` when running `astro dev`
- `import.meta.env.PROD` - `true` when running `astro build`
- `import.meta.env.MODE` - "development" or "production"
- `import.meta.env.PUBLIC_*` - Custom public environment variables

## Testing Draft Visibility

### Local Development
```bash
npm run dev
# Drafts are always visible
# Look for "DRAFT" badges on draft posts
```

### Production Preview
```bash
npm run build
npm run preview
# Drafts should be hidden
# No draft posts should appear
```

### With Environment Variable
```bash
PUBLIC_SHOW_DRAFTS_IN_PREVIEW=true npm run build
npm run preview
# Drafts should be visible (simulating preview deployment)
```

## Affected Components

The following files implement draft visibility logic:

1. **`/src/utils/blog.ts`**
   - Core filtering logic for draft posts
   - Line 133-134: Environment-aware draft filtering

2. **`/src/components/blog/GridItem.astro`**
   - Visual draft indicators (amber "DRAFT" badge)
   - Lines 21-23: Environment detection
   - Lines 45-51: Draft badge rendering

## RSS and Search Behavior

- **RSS Feed:** Automatically excludes drafts in production (uses `fetchPosts()`)
- **Search Index:** Built during `npm run build`, excludes drafts
- **Sitemap:** Only includes pages that are built (drafts excluded in production)

## Troubleshooting

### Drafts Not Showing in Development

1. Verify you're running `npm run dev` (not `npm run preview`)
2. Check that posts have `draft: true` in frontmatter
3. Clear browser cache and restart dev server

### Drafts Appearing in Production

1. Ensure `PUBLIC_SHOW_DRAFTS_IN_PREVIEW` is not set in production environment
2. Verify build command is `npm run build` (not dev mode)
3. Check deployment logs for environment variable values

### Preview Deployment Issues

1. Confirm environment variable is set correctly in Cloudflare Pages
2. Variable name must be exactly `PUBLIC_SHOW_DRAFTS_IN_PREVIEW`
3. Value must be exactly `"true"` (lowercase, as a string)
4. Trigger a new deployment after changing environment variables