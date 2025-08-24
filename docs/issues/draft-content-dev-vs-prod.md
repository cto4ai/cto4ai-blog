# Draft Content: Dev vs Production Mode Issue

## Current Behavior

The blog currently filters out all draft content regardless of environment (development or production). This makes it impossible to preview draft posts during development.

## Issue Details

### Location
- **File:** `/src/utils/blog.ts`
- **Line:** 122 (in `load` function within `fetchPosts`)
- **Current Code:**
  ```typescript
  .filter((post) => !post.draft)
  ```

### Impact
- 5 draft posts are currently invisible even in development mode
- Authors cannot preview draft content before publishing
- Testing draft posts requires temporarily setting `draft: false`
- This differs from Hugo's behavior where drafts are visible in dev mode

## Expected Behavior (Hugo-style Workflow)

Draft content should be:
- **Visible** in development mode (`npm run dev`)
- **Hidden** in production mode (`npm run build`)
- **Optionally visible** in preview deployments (with environment variable)

## Technical Context

### Astro Environment Variables
Astro provides built-in environment detection:
- `import.meta.env.DEV` - `true` when running `astro dev`
- `import.meta.env.PROD` - `true` when running `astro build`
- `import.meta.env.MODE` - "development" or "production"

### Recommended Solution

#### Basic Implementation
Update the filter to be environment-aware:
```typescript
// Using PROD flag (preferred for clarity)
.filter((post) => import.meta.env.PROD ? !post.draft : true)
```

#### Enhanced Implementation (with Preview Support)
Allow drafts in preview deployments:
```typescript
const SHOW_DRAFTS = import.meta.env.DEV || 
                    import.meta.env.SHOW_DRAFTS_IN_PREVIEW === "true";

.filter((post) => SHOW_DRAFTS ? true : !post.draft)
```

Then set `SHOW_DRAFTS_IN_PREVIEW=true` in Netlify/Vercel preview environment variables.

## Additional Considerations

### Visual Indicators
Consider adding visual draft indicators in development:
- Add "DRAFT" badge to post cards
- Use distinctive styling (e.g., yellow/orange background)
- Show indicators when drafts are visible (dev or preview modes)

Example implementation in components:
```astro
---
// In component frontmatter
const SHOW_DRAFTS = import.meta.env.DEV || 
                    import.meta.env.SHOW_DRAFTS_IN_PREVIEW === "true";
---

{SHOW_DRAFTS && post.draft && (
  <span class="px-2 py-1 text-xs bg-yellow-500 text-white rounded">DRAFT</span>
)}
```

### Dynamic Routes
Ensure `/src/pages/p/[...blog].astro` uses the same filtering logic through `getStaticPathsBlogPost()`. Draft posts should not generate routes in production builds.

The `getStaticPathsBlogPost()` function in `/src/utils/blog.ts` should also apply the same filtering:
```typescript
export const getStaticPathsBlogPost = async () => {
  if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
  // fetchPosts() already filters drafts based on environment
  return (await fetchPosts()).flatMap((post) => ({
    params: { blog: post.permalink },
    props: { post },
  }));
};
```

### Search Indexing
- Pagefind builds search index during `npm run build`
- Draft posts won't be searchable in production (correct)
- Dev mode search behavior may differ from production

### RSS and Sitemap
- RSS feed generation should use filtered posts
- Sitemap will automatically exclude drafts (only built routes appear)
- Optionally use sitemap's `filter(pageUrl)` hook for explicit control

### Testing Checklist
After implementation, verify:
1. **Dev Mode** (`npm run dev`):
   - ✅ All 5 draft posts appear
   - ✅ Draft badges visible (if implemented)
2. **Production Preview** (`npm run build && npm run preview`):
   - ✅ Draft posts hidden
   - ✅ Only 74 published posts visible
3. **Build Artifacts**:
   - ✅ RSS feed excludes drafts
   - ✅ Search index excludes drafts
   - ✅ No draft post HTML files in `/dist`

## Affected Files

- `/src/utils/blog.ts` - Main filtering logic
- Components that display posts (for draft indicators):
  - `/src/components/blog/GridItem.astro`
  - `/src/pages/index.astro`
  - `/src/pages/archive.astro`

## Current Draft Posts

The following posts are currently marked as drafts and invisible:
1. `/src/data/content/test-phase2-content/index.mdx`
2. `/src/data/content/llama-2/index.mdx`
3. `/src/data/content/ai-coding-all-about-context/index.mdx`
4. `/src/data/content/ai-and-law/index.mdx`
5. `/src/data/content/cto-for-the-build/index.mdx`

## References

- [Astro Environment Variables Documentation](https://docs.astro.build/en/guides/environment-variables/)
- [Astro Content Collections Best Practices](https://docs.astro.build/en/guides/content-collections/)
- [Managing Draft Content in Astro](https://johndalesandro.com/blog/astro-manage-draft-and-published-post-statuses-by-adding-a-content-collection-schema-property/)

## Appendix: Cloudflare Pages Deployment

### Deployment Workflow

Similar to the current Hugo setup, Cloudflare Pages will:
1. **Detect pushes** to GitHub (main or feature branches) via webhook
2. **Run the build** on Cloudflare's servers:
   - Install dependencies: `npm install`
   - Build the site: `npm run build`
   - Deploy the `/dist` folder
3. **No local build required** - push source code only, never commit `/dist`

### Build Configuration

**Cloudflare Pages Settings:**
```yaml
Build command: npm run build
Build output directory: /dist
Node version: 18.17.0
```

**Node Version Setup:**
Create `.nvmrc` file in project root:
```
18.17.0
```
Or set `NODE_VERSION=18.17.0` in Cloudflare Pages environment variables.

### Environment Variables Strategy

**Production Branch (main):**
- No special variables needed
- Drafts automatically hidden via `import.meta.env.PROD`

**Preview Branches:**
- Set `SHOW_DRAFTS_IN_PREVIEW=true` to show drafts
- Each branch gets a preview URL: `branch-name.cto4ai.pages.dev`

### Implementation for Cloudflare Pages

Update `/src/utils/blog.ts` line 122:
```typescript
// Support for Cloudflare Pages preview deployments
const SHOW_DRAFTS = import.meta.env.DEV || 
                    import.meta.env.SHOW_DRAFTS_IN_PREVIEW === "true";

.filter((post) => SHOW_DRAFTS ? true : !post.draft)
```

### Security Considerations

- **Preview URLs are public** by default
- If showing drafts in previews, consider:
  - Using Cloudflare Access to restrict preview URLs
  - Or keeping `SHOW_DRAFTS_IN_PREVIEW` unset for sensitive drafts

### Cloudflare-Specific Notes

1. **Auto Minify**: May need to disable if hydration issues occur
2. **Wrangler CLI**: Can test locally with `wrangler pages dev ./dist`
3. **SSR vs Static**: Current static build works fine; SSR requires `@astrojs/cloudflare` adapter
4. **Build Cache**: Cloudflare caches dependencies between builds for faster deployments

### Deployment Comparison

| Aspect | Current Hugo | New Astro |
|--------|--------------|-----------|
| Trigger | Git push | Git push |
| Build Location | Cloudflare servers | Cloudflare servers |
| Build Command | `hugo` | `npm run build` |
| Output Folder | `/public` | `/dist` |
| Preview Deployments | Yes | Yes |
| Draft Handling | `--buildDrafts` flag | Environment variables |