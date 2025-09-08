# Cloudflare Build Optimization

## Current Build Performance

- **Local build time**: ~21 seconds for 163 pages
- **Cloudflare build time**: Likely longer due to infrastructure overhead
- **Total image assets**: 243MB (335 files)
- **Pagefind index size**: ~1MB

### Build Time Breakdown

```
- Vite bundling: ~5.3s
- Static entrypoints: ~5.4s
- HTML compression: ~6s (163 files)
- Pagefind indexing: ~1s
- Other processing: ~3s
```

## Performance Bottlenecks

### 1. Image Processing (Primary Issue)

- 243MB of images being processed during build
- Astro's image optimization runs at build time
- Significant overhead for 335 image files

### 2. Compression Overhead

- `astro-compress` processes all HTML, CSS, and JS files
- Cloudflare already provides automatic compression
- Redundant compression adding ~6s to build time

### 3. Dependency Installation

- Full `npm install` on each build
- No caching of node_modules between builds

## Optimization Recommendations

### Priority 1: Disable Build-Time Image Processing

**Impact**: Could save 30-50% of build time

```typescript
// astro.config.ts modification
export default defineConfig({
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false, // Skip processing
      },
    },
  },
});
```

Alternative: Use Cloudflare Image Resizing service for on-demand optimization.

### Priority 2: Remove Redundant Compression

**Impact**: Save ~6 seconds

```typescript
// Remove or configure astro-compress
compress({
  CSS: false, // Cloudflare handles this
  HTML: false, // Cloudflare handles this
  JavaScript: false, // Cloudflare handles this
  Image: false,
  SVG: false,
  Logger: 0,
});
```

### Priority 3: Optimize Build Command

**Impact**: Minor improvements

Current in `package.json`:

```json
"build": "astro build"
```

Optimized:

```json
"build": "NODE_ENV=production astro build --no-stats"
```

For Cloudflare Pages, use:

```bash
npm ci && npm run build
```

### Priority 4: Image Strategy Improvements

1. **Pre-optimize images locally**:

   ```bash
   # Convert PNGs to WebP before commit
   find src/assets/images -name "*.png" -exec cwebp {} -o {}.webp \;
   ```

2. **Use external CDN**:
   - Cloudflare Images
   - Cloudinary
   - ImageKit

3. **Lazy loading**: Already implemented ✓

### Priority 5: Search Index Optimization

Consider moving Pagefind indexing to post-build or using Cloudflare Workers for search.

## Quick Wins Checklist

- [ ] Disable `astro-compress` entirely
- [ ] Switch to `npm ci` in Cloudflare Pages build command
- [ ] Add build caching in Cloudflare Pages settings
- [ ] Test build without image optimization
- [ ] Convert largest PNGs to WebP format

## Expected Results

With all optimizations:

- **Current**: ~21s local, likely 30-45s on Cloudflare
- **Optimized**: ~10-12s local, 15-20s on Cloudflare
- **Reduction**: 40-50% faster builds

## Implementation Notes

1. Test each optimization individually to measure impact
2. Monitor build times in Cloudflare Pages dashboard
3. Consider trade-offs between build time and runtime performance
4. Cloudflare's automatic optimizations often make build-time optimization redundant

## References

- [Astro Image Optimization Docs](https://docs.astro.build/en/guides/images/)
- [Cloudflare Image Resizing](https://developers.cloudflare.com/images/image-resizing/)
- [Cloudflare Pages Build Configuration](https://developers.cloudflare.com/pages/platform/build-configuration/)
