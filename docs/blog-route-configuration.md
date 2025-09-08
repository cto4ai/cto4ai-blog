# Blog Route Configuration

## Current State

The site currently has two routes that display the blog listing:

- `/blog` - Active but considered obsolete
- `/archive` - The preferred route for viewing all blog posts

## Why /blog Route Exists

The `/blog` route is created by the interaction between:

1. **Dynamic Route Structure**: The `src/pages/[...blog]/` directory contains a catch-all dynamic route parameter
2. **Configuration**: The `src/config.yaml` file specifies `pathname: 'blog'` under `apps.blog.list`
3. **Route Generation**: Astro uses this configuration to generate the actual URL paths

### How It Works

- The `[...blog]` folder name is NOT a literal path - it's a dynamic parameter placeholder
- The actual URL path comes from `config.yaml`: `apps.blog.list.pathname: 'blog'`
- This generates routes like:
  - `/blog` - Main listing
  - `/blog/2` - Pagination
  - `/blog/category/[name]` - Category pages
  - `/blog/tag[name]` - Tag pages

## Options to Disable /blog Route

Since the site hasn't launched yet, there's no need for backward compatibility. Here are the options:

### Option 1: Disable the listing route entirely

```yaml
# In src/config.yaml
apps:
  blog:
    list:
      isEnabled: false # This disables the blog listing route
      pathname: 'blog' # Becomes irrelevant when disabled
```

### Option 2: Set empty pathname

```yaml
# In src/config.yaml
apps:
  blog:
    list:
      isEnabled: true
      pathname: '' # Empty string = no blog listing route created
```

### Option 3: Set to unused path

```yaml
# In src/config.yaml
apps:
  blog:
    list:
      isEnabled: true
      pathname: '_disabled' # Route would be /_disabled (effectively hidden)
```

## Impact of Changes

Disabling or changing the blog pathname will:

- ✅ Remove the `/blog` route
- ✅ Keep `/archive` as the only blog listing page
- ✅ Maintain all individual post routes at `/p/[slug]`
- ⚠️ May affect category/tag routes depending on implementation choice

## Related Files

- `src/config.yaml` - Configuration file containing the pathname setting
- `src/pages/[...blog]/[...page].astro` - Dynamic route handler for blog listing
- `src/pages/archive.astro` - Preferred blog listing page
- `src/utils/blog.ts` - Contains `getStaticPathsBlogList` function that uses BLOG_BASE
- `src/utils/permalinks.ts` - Defines BLOG_BASE from the configuration

## Recommendation

When ready to implement, Option 1 (disabling the list route) is cleanest since:

- We have `/archive` as the dedicated blog listing page
- Categories and tags can still function if needed
- No confusing hidden routes

## Implementation Checklist

When ready to disable the /blog route:

- [ ] Update `src/config.yaml` to disable or modify the blog list pathname
- [ ] Test that `/archive` still works correctly
- [ ] Verify category and tag pages still function if needed
- [ ] Update any internal links that might reference `/blog`
- [ ] Test in both development and production builds
