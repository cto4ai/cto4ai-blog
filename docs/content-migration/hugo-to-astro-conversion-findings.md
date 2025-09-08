# Hugo-to-Astro Conversion Findings

This document captures key findings from migrating 27 Hugo blog posts to Astro MDX format. These patterns will likely apply to other content types during the migration.

## Hugo Shortcode Conversion Patterns

### Image Shortcodes → SingleImage Components

**Hugo `figure` shortcode:**

```html
{{< figure src="image.jpg" alt="Description" >}}
```

**Astro conversion:**

```jsx
<SingleImage src="image.jpg" alt="Description" postDir="post-directory" size="lg" />
```

**Hugo `img-caps` shortcode:**

```html
{{< img-caps src="image.jpg" caption="Main caption" subcaption="Sub caption" >}}
```

**Astro conversion:**

```jsx
<SingleImage src="image.jpg" alt="Main caption - Sub caption" postDir="post-directory" size="lg" />
```

**Hugo `xl-imgs` shortcode:**

```html
{{< xl-imgs src="image.jpg" alt="Description" >}}
```

**Astro conversion:**

```jsx
<SingleImage src="image.jpg" alt="Description" postDir="post-directory" size="2xl" />
```

### Content Structure Shortcodes

**Hugo `blocksection` shortcode:**

```html
{{< blocksection >}} Content here {{< /blocksection >}}
```

**Astro conversion:**

```markdown
> **Quote:**
>
> Content here
```

### Media Shortcodes

**Hugo `hugo-video` shortcode:**

```html
{{< hugo-video src="video.mp4" width="75%" autoplay="true" muted="true" loop="true" >}}
```

**Astro conversion:**

```html
<video autoplay muted loop width="75%" style="max-width: 100%">
  <source src="/videos/video.mp4" type="video/mp4" />
</video>
```

**Hugo `spotify` shortcode:**

```html
{{< spotify type="track" id="3cLqK3LPVrTIzfENVmYLoU" width="300" height="380" >}}
```

**Astro conversion:**

```html
<iframe
  src="https://open.spotify.com/embed/track/3cLqK3LPVrTIzfENVmYLoU"
  width="300"
  height="380"
  frameborder="0"
  allowtransparency="true"
  allow="encrypted-media"
>
</iframe>
```

**Hugo `rawhtml` shortcode:**

```html
{{< rawhtml >}}
<div>Complex HTML content</div>
{{< /rawhtml >}}
```

**Astro conversion:**

```html
<div>Complex HTML content</div>
```

## MDX/JSX Parsing Issues

### JavaScript Syntax Conflicts

**Problem:** MDX interprets certain syntax as JSX

```markdown
- Inline expressions ${...} interpolate values
  <20B parameter regime
```

**Solution:** Escape or modify syntax

```markdown
- Inline expressions `${...}` interpolate values  
  sub-20B parameter regime
```

### Complex JavaScript in HTML

**Problem:** Acorn parser errors with complex JavaScript

```html
<script>
  trends.embed.renderExploreWidget("TIMESERIES", {
    "comparisonItem": [...]
  });
</script>
```

**Solution:** Use React-style dangerouslySetInnerHTML

```jsx
<script
  type="text/javascript"
  dangerouslySetInnerHTML={{
    __html: `
  trends.embed.renderExploreWidget("TIMESERIES", {
    "comparisonItem": [...]
  });
`,
  }}
/>
```

## Frontmatter Cleanup

### Empty Tags/Categories

**Problem:** Hugo accepts empty strings in arrays

```yaml
tags: ['']
categories: ['']
```

**Solution:** Remove empty entries or replace with meaningful tags

```yaml
tags: ['AI', 'Technology']
categories: ['Blog']
```

## Image Asset Migration

### Source Image Priority

- **Always use source images** from Hugo's `assets/` directories
- **Never use generated images** from `_gen/` directories
- Generated images are temporary and may have different dimensions/quality

### Directory Structure

**Hugo structure:**

```
/content/blog/post-name/
  index.md
  image.jpg
```

**Astro structure:**

```
/src/data/posts/post-name.mdx
/src/assets/images/blog/post-name/
  image.jpg
```

## Required Astro Setup

### Component Imports

All migrated posts need these imports:

```javascript
import SingleImage from '~/components/ui/SingleImage.astro';
import ImageGallery from '~/components/ui/ImageGallery.astro';
```

### Markdown Enhancement

For typography (automatic dash conversion):

```javascript
// astro.config.ts
import remarkSmartypants from 'remark-smartypants';

export default defineConfig({
  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin, [remarkSmartypants, { dashes: 'oldschool' }]],
  },
});
```

## Testing Strategy

1. **Build Testing:** Run `npm run build` to catch syntax/parsing errors
2. **Browser Testing:** Use Playwright to verify actual rendering
3. **Shortcode Verification:** Search for remaining `{{<` patterns

## Migration Script Limitations

The `complete-conversion.py` script only handles:

- Basic frontmatter conversion
- `imgs` shortcode conversion
- Asset copying

**Manual conversion required for:**

- figure, img-caps, xl-imgs shortcodes
- blocksection, rawhtml shortcodes
- hugo-video, spotify shortcodes
- JSX syntax conflicts
- Complex JavaScript in HTML
- Empty frontmatter fields

## Performance Notes

- Static generation eliminates runtime shortcode processing
- All images are pre-processed and optimized
- No server-side template rendering needed
- Client-side JavaScript handles interactivity only where needed
