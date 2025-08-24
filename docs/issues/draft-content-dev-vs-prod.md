# Draft Content: Dev vs Production Mode Issue

## Current Behavior

The blog currently filters out all draft content regardless of environment (development or production). This makes it impossible to preview draft posts during development.

## Issue Details

### Location
- **File:** `/src/utils/blog.ts`
- **Line:** 132
- **Current Code:**
  ```typescript
  .filter((post) => !post.draft)
  ```

### Impact
- 5 draft posts are currently invisible even in development mode
- Authors cannot preview draft content before publishing
- Testing draft posts requires temporarily setting `draft: false`

## Expected Behavior (Astro Best Practice)

Draft content should be:
- **Visible** in development mode (`npm run dev`)
- **Hidden** in production mode (`npm run build`)

## Technical Context

### Astro Environment Variables
Astro provides built-in environment detection:
- `import.meta.env.DEV` - `true` when running `astro dev`
- `import.meta.env.PROD` - `true` when running `astro build`
- `import.meta.env.MODE` - "development" or "production"

### Recommended Solution

Update the filter to be environment-aware:
```typescript
// Option 1: Using DEV flag
.filter((post) => import.meta.env.DEV ? true : !post.draft)

// Option 2: Using PROD flag (preferred for clarity)
.filter((post) => import.meta.env.PROD ? !post.draft : true)
```

## Additional Considerations

### Visual Indicators
Consider adding visual draft indicators in development:
- Add "DRAFT" badge to post cards
- Use distinctive styling (e.g., yellow/orange background)
- Only show indicators when `import.meta.env.DEV === true`

### Search Indexing
- Pagefind builds search index during `npm run build`
- Draft posts won't be searchable in production (correct)
- Dev mode search behavior may differ from production

### Testing
After implementation, verify:
1. Draft posts appear with `npm run dev`
2. Draft posts hidden with `npm run build && npm run preview`
3. Production deployment excludes draft content

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