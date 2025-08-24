# Managing Draft Content in Astro (Hugo-style workflow)

This guide shows how to replicate Hugo’s `draft=true` behavior in Astro: drafts visible in dev, hidden in production builds, with additional notes for Cloudflare Pages deployment.

---

## Core Idea

- Use **Astro content collections** and `getCollection()`’s filter predicate.
- Detect environment with `import.meta.env.DEV` (for `astro dev`) and `import.meta.env.PROD` (for `astro build`).
- Filter drafts accordingly.

---

## Step 1. Define collection schema

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
    // ...other fields
  }),
});

export const collections = { blog };
```

This ensures typed `data.draft` for filtering.

---

## Step 2. Filter posts by environment

```ts
// src/utils/blog.ts
import { getCollection } from "astro:content";

export async function getPosts() {
  const posts = await getCollection(
    "blog",
    ({ data }) => (import.meta.env.PROD ? data.draft !== true : true)
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
```

- In **dev**: drafts are included.
- In **prod**: drafts are excluded.

---

## Step 3. Dynamic routes from filtered posts

```ts
// src/pages/blog/[slug].astro
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection(
    "blog",
    ({ data }) => (import.meta.env.PROD ? data.draft !== true : true)
  );
  return posts.map((p) => ({ params: { slug: p.slug }, props: { post: p } }));
}
```

Result: Drafts are never built into production HTML.

---

## Step 4. Handle RSS and sitemap

- **RSS**: supply only filtered posts when building the feed.
- **Sitemap**: only published routes are built, so drafts won’t appear. Optionally use the `filter(pageUrl)` hook in `@astrojs/sitemap`.

---

## Step 5. Optional: enable drafts in preview builds

By default, Cloudflare Pages (like Netlify/Vercel) runs **production builds** for preview deployments, meaning drafts will be hidden. To show drafts in previews:

```ts
const SHOW_DRAFTS =
  import.meta.env.DEV || import.meta.env.SHOW_DRAFTS_IN_PREVIEW === "true";

const posts = await getCollection(
  "blog",
  ({ data }) => (SHOW_DRAFTS ? true : data.draft !== true)
);
```

In Cloudflare Pages:

- Set `SHOW_DRAFTS_IN_PREVIEW=true` in **Preview Environment Variables**.
- Leave it unset/false in production.

This replicates Hugo’s workflow: drafts visible locally and in preview builds, hidden in production.

---

## Cloudflare Pages Considerations

### Node version

- Cloudflare defaults to Node.js 12.x. Astro requires Node ≥16.13.
- Add an `.nvmrc` file or set `NODE_VERSION` in Cloudflare Pages settings.

### Preview deployments

- Every branch/PR gets a preview URL. Drafts will be hidden unless you enable them with `SHOW_DRAFTS_IN_PREVIEW`.
- Protect preview deployments with **Cloudflare Access** if you want drafts or staging content restricted.

### SSR vs Static

- For static blogs, default build works fine.
- If you want SSR or advanced features, use `@astrojs/cloudflare` adapter.

### Wrangler CLI support

- You can preview locally or deploy with:
  ```bash
  wrangler pages dev ./dist
  wrangler pages deploy ./dist
  ```

### Hydration issues

- If you see hydration mismatches, disable Cloudflare’s “Auto Minify” setting.

---

## QA checklist

- `npm run dev`: drafts appear (optionally mark them with a badge).
- Cloudflare Pages **Preview Deployment**: drafts appear if `SHOW_DRAFTS_IN_PREVIEW=true`.
- `npm run build` or Cloudflare **Production Deployment**: drafts are hidden.
- RSS, sitemap, archive/tag pages: all built from filtered posts.
- Preview visibility: restrict access with Cloudflare Access if needed.

---

✅ This replicates Hugo’s draft workflow in Astro and aligns with Cloudflare Pages deployment best practices.

