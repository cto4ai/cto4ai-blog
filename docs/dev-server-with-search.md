# Dev Server with Searchable Draft Content

## Current Behavior

The Astro dev server (`npm run dev`) uses the Pagefind search index from the last production build (`npm run build`). This means:
- Draft posts are visible in the dev server (due to `import.meta.env.DEV` being true)
- But draft posts are NOT searchable because the search index was built without them
- The search index becomes stale as you add/edit content during development

## How Pagefind Works

- Pagefind only builds its search index during production builds
- It analyzes the static HTML output in the `dist` directory
- The dev server uses whatever index exists in `dist/pagefind/` from the last build
- The index build time can be checked with: `stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" dist/pagefind/pagefind.js`

## Proposed Solution: Dev Server Script

Similar to the Hugo site's `dev_server.sh`, we can create a script that:
1. Builds the site with drafts included
2. Generates a fresh search index
3. Starts the dev server

### Option 1: Shell Script

Create `/Users/jackivers/Projects/cto4ai-blog/dev_server.sh`:

```bash
#!/usr/bin/env zsh
# Build site with drafts included for search index
PUBLIC_SHOW_DRAFTS_IN_PREVIEW=true npm run build

# Start the dev server
npm run dev
```

Make it executable: `chmod +x dev_server.sh`

### Option 2: NPM Script

Add to `package.json`:

```json
"scripts": {
  "dev:with-search": "PUBLIC_SHOW_DRAFTS_IN_PREVIEW=true astro build && astro dev"
}
```

## How It Works

1. The `PUBLIC_SHOW_DRAFTS_IN_PREVIEW=true` environment variable tells the build to include draft posts
2. This is checked in `/src/utils/blog.ts`:
   ```typescript
   const SHOW_DRAFTS = import.meta.env.DEV || 
                       import.meta.env.PUBLIC_SHOW_DRAFTS_IN_PREVIEW === "true";
   ```
3. The build creates a search index that includes draft content
4. The dev server then uses this fresh, complete index

## Benefits

- Draft posts become searchable during development
- Matches the existing Hugo workflow
- Simple one-command startup
- Fresh search index with all current content

## Trade-offs

- Slower startup time (needs to build before starting dev server)
- Build runs every time you start development
- Could add a flag to skip the build when not needed

## Current Hugo Implementation

For reference, the Hugo site uses this approach in `/Users/jackivers/Projects/hugo/craftycto/dev_server.sh`:

```bash
#!/usr/bin/env zsh
hugo -D                    # Build with drafts
npm_config_yes=true npx pagefind --site "public" --output-subdir ../static/pagefind
hugo server -D --cleanDestinationDir --gc  # Start server with drafts
```

## Status

Not implemented yet - saved for future reference when searchable draft content becomes a priority.