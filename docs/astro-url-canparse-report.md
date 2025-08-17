# Resolving Astro 5 MDX errors caused by `URL.canParse`

## Background

During your migration from **CraftyCTO/Hugo** to **Astro/CTO4**, MDX processing fails with the error:

```
TypeError: URL.canParse is not a function
```

The attached `FINDINGS.md` file notes that this error is thrown from the compiled `@astrojs/markdown‑remark/dist/remark‑collect‑images.js` and Vite’s content module when processing MDX files. Regular `.astro` pages render fine; the failure is specific to `.mdx` content collections.

## Root Cause

Astro’s markdown image‑collection plugin (`remark-collect-images`) calls `URL.canParse(url)` to decide whether a link is remote or local. In a Node runtime this works — `URL.canParse` was added in Node 18.17.0 and stabilized in Node 19.9.0 — but when the code is bundled by Vite for MDX processing it runs in a browser‑like context where `URL.canParse` is missing. That produces the `TypeError` you observed.

## Solutions

1. **Polyfill `URL.canParse`**  
   Add this snippet to `astro.config.mjs` or a setup file:

   ```js
   if (typeof URL.canParse !== 'function') {
     URL.canParse = (input, base) => {
       try {
         new URL(input, base);
         return true;
       } catch {
         return false;
       }
     };
   }
   ```

   This reproduces the behaviour described in the Node docs.

2. **Run Node 20 LTS instead of Node 22.x**  
   Astro 5.13.2 and its dependencies are primarily tested against Node 20. Running Node 22.1 may expose edge cases in Vite’s bundler where `URL.canParse` is missing. Switching to Node 20 eliminates this problem.

3. **Disable Astro’s markdown image collection**  
   In `astro.config.mjs`:

   ```js
   import { defineConfig } from 'astro/config';
   import mdx from '@astrojs/mdx';

   export default defineConfig({
     integrations: [mdx()],
     markdown: {
       image: {
         remotePatterns: [],
         domains: [],
       },
     },
   });
   ```

   This prevents the faulty `URL.canParse` path from being triggered.

4. **Pin or downgrade `@astrojs/markdown-remark`**  
   Versions before 5.13.x did not rely on `URL.canParse`. Temporarily using an older package version avoids the bug, though it means missing later fixes.

5. **Watch for an Astro patch**  
   Other frameworks (e.g. Next.js 14.2.13) have patched this exact issue by adding a polyfill. It’s likely Astro will too. Watch the `withastro/astro` GitHub repo for a release that fixes `remark-collect-images`.

## Conclusion

This error is not caused by your content. It is due to Astro 5.13.2’s reliance on `URL.canParse` inside MDX image processing. The quickest fix is either to polyfill `URL.canParse` or to run Node 20 LTS. Both approaches unblock MDX processing and allow you to continue migrating your blog content.
