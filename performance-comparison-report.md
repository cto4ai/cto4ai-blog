# Performance Comparison Report: CraftyCTO vs CTO4.AI

**Date**: August 26, 2025  
**Tool**: Google PageSpeed Insights  
**Test Location**: CDT (Central Daylight Time)  
**Device**: Mobile (Moto G Power emulated with Lighthouse 12.8.0)

## Executive Summary

This report compares the performance of the Hugo-based blog at craftycto.com/blog with the new Astro-based blog at cto4.ai. Based on PageSpeed Insights testing, both sites perform exceptionally well, with the Hugo site having a slight edge in performance metrics.

## Homepage/Blog Listing Comparison

### Mobile Performance Scores

| Metric                | CraftyCTO (Hugo) | CTO4.AI (Astro) | Difference |
| --------------------- | ---------------- | --------------- | ---------- |
| **Performance Score** | 98               | 96              | -2 points  |
| **Accessibility**     | 100              | 98              | -2 points  |
| **Best Practices**    | 100              | 100             | 0          |
| **SEO**               | 100              | 100             | 0          |

### Core Web Vitals (Mobile)

| Metric                             | CraftyCTO (Hugo) | CTO4.AI (Astro) | Difference         | Status |
| ---------------------------------- | ---------------- | --------------- | ------------------ | ------ |
| **First Contentful Paint (FCP)**   | 1.1s             | 1.4s            | +0.3s (27% slower) | ⚠️     |
| **Largest Contentful Paint (LCP)** | 1.1s             | 2.0s            | +0.9s (82% slower) | ⚠️     |
| **Total Blocking Time (TBT)**      | 0ms              | 30ms            | +30ms              | ⚠️     |
| **Cumulative Layout Shift (CLS)**  | 0                | 0               | 0                  | ✅     |
| **Speed Index**                    | 3.8s             | 4.4s            | +0.6s (16% slower) | ⚠️     |

## Key Findings

### Strengths of Both Sites

- ✅ Both sites achieve excellent performance scores (96-98)
- ✅ Perfect scores for Best Practices and SEO
- ✅ Zero Cumulative Layout Shift (excellent visual stability)
- ✅ Both sites have minimal Total Blocking Time

### CraftyCTO (Hugo) Advantages

- 🚀 Faster initial paint times (FCP: 1.1s vs 1.4s)
- 🚀 Superior LCP performance (1.1s vs 2.0s)
- 🚀 Zero blocking time (0ms vs 30ms)
- 🚀 Better Speed Index (3.8s vs 4.4s)

### CTO4.AI (Astro) Opportunities for Improvement

Based on PageSpeed Insights recommendations:

1. **Render-blocking resources** - Estimated savings of 730ms
   - Consider optimizing CSS/JS loading strategies
2. **Image optimization** - Estimated savings of 41 KiB
   - Further optimize image formats and sizes
3. **Unused CSS** - Estimated savings of 11 KiB
   - Remove or defer unused CSS

4. **Cache lifetimes** - Estimated savings of 4 KiB
   - Implement more efficient caching strategies

## Recommendations

### High Priority

1. **Optimize LCP on CTO4.AI**: The 2.0s LCP is approaching the "needs improvement" threshold (2.5s). Focus on:
   - Preloading critical resources
   - Optimizing the largest content element loading
   - Reducing render-blocking resources

2. **Reduce FCP time on CTO4.AI**: The 300ms difference in FCP could be improved by:
   - Inlining critical CSS
   - Deferring non-critical JavaScript
   - Optimizing font loading

### Medium Priority

3. **Minimize Total Blocking Time**: While 30ms is excellent, achieving 0ms like Hugo would improve interactivity

4. **Speed Index optimization**: The 600ms difference suggests the visual loading progression could be smoother

### Low Priority

5. **Accessibility improvements**: Fix the heading hierarchy issue (h1-h6 sequencing)

## Conclusion

Both sites deliver excellent performance, with the Hugo site (craftycto.com/blog) currently outperforming the Astro site (cto4.ai) by a small margin. The Astro site at CTO4.AI still achieves a strong 96 performance score, which is excellent for user experience and SEO.

The performance differences are relatively minor and both sites provide a fast, responsive user experience. The main opportunity for CTO4.AI is to optimize the Largest Contentful Paint metric to match the exceptional performance of the Hugo site.

## Testing Methodology

- **Tool**: Google PageSpeed Insights (powered by Lighthouse 12.8.0)
- **Network**: Simulated Slow 4G throttling
- **Device**: Emulated Moto G Power (mobile)
- **Browser**: HeadlessChromium 137.0.7151.119
- **Test Type**: Lab data (controlled environment)

---

_Note: These are lab test results under simulated conditions. Real-world performance may vary based on user location, device, and network conditions. Consider implementing Real User Monitoring (RUM) for production insights._
