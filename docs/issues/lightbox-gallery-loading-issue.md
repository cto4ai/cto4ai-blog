# Lightbox/Gallery Loading Issue

## Resolution Status

✅ **RESOLVED** - August 22, 2025

The issue has been successfully resolved using a global LightboxManager implementation in Layout.astro. The lightbox now works correctly across all page navigations and browser refreshes.

## Problem Description

We have a recurring problem with our lightbox/gallery functionality on MDX-generated pages. The lightbox should be invoked on every image click within pages that include one of the following image references:

```jsx
<SingleImage src="eno_context.png" alt="Eno Context" size="2xl" postDir="aiewf2025-my-day-2-highlights" />
<ImageGallery images={["eno_planning_1.png", "eno_planning_2.png"]} postDir="aiewf2025-my-day-2-highlights" size="xl" />
```

## Symptoms

- The lightbox/gallery works after a dev server restart
- It subsequently fails (stops working)
- A hard refresh causes the gallery/lightbox to work again
- The issue appears to be related to loading the component after the right event

## Previous Fix Attempts

### Commit a06511e (Aug 21, 2025)

- Replaced `astro:after-swap` with `astro:page-load` event
- Added proper DOM readiness checks for initial page loads
- Pattern followed from search.astro for correct lifecycle handling
- Fix attempted to resolve issue where lightbox only worked after page refresh

Current implementation in both SingleImage.astro and ImageGallery.astro:

```javascript
// Use Astro's lifecycle event for navigation
document.addEventListener('astro:page-load', initLightbox);

// Handle initial page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLightbox);
} else {
  initLightbox();
}
```

## Testing Observations

- **Important**: Issue does NOT occur during Playwright automated testing
- Issue only manifests in real browser usage
- This suggests the problem is related to:
  - Browser-specific script execution timing
  - View Transitions API behavior differences
  - Event listener persistence during soft navigation

## Root Cause Analysis

The issue appears to be related to Astro's View Transitions and how scripts are handled during client-side navigation:

1. **Initial Load**: Works correctly - scripts execute, event listeners attach, GLightbox initializes
2. **After Navigation**: Scripts may not re-execute properly or event listeners are lost
3. **Hard Refresh**: Forces full page reload, re-initializing everything correctly

Potential causes:

- Multiple event listener attachments causing conflicts
- GLightbox instance not being properly cleaned up/reinitialized
- Scripts with `is:inline` being duplicated during navigation
- Event listeners not persisting through View Transitions

## Implemented Solution ✅

### Global Script Management - SUCCESSFUL

Successfully implemented a global script in Layout.astro that manages lightbox state across navigations:

1. **Created LightboxManager class** in Layout.astro with:
   - Singleton pattern to ensure single instance
   - Cleanup on `astro:before-swap` event
   - Reinitialization on `astro:page-load` event
   - Debug logging for troubleshooting
   - Proper instance destruction and recreation

2. **Key features of the implementation**:
   - Prevents duplicate event listener attachments
   - Properly destroys GLightbox instance before navigation
   - Adds small delay (50ms) to ensure DOM is ready
   - Handles both initial page load and client-side navigation
   - Debug mode enabled for monitoring behavior

3. **Files modified**:
   - `/src/layouts/Layout.astro` - Added global LightboxManager script
   - `/src/components/ui/SingleImage.astro` - Removed local script initialization
   - `/src/components/ui/ImageGallery.astro` - Removed local script initialization

### How it works:

1. On initial page load or navigation, the manager checks for lightbox triggers
2. Before navigation (`astro:before-swap`), it destroys the existing instance
3. After navigation (`astro:page-load`), it creates a new instance for the new page
4. The singleton pattern ensures only one manager exists across all navigations

### Testing Confirmation ✅:

The solution has been tested and confirmed working:

1. ✅ Lightbox works on initial page load
2. ✅ Lightbox continues working after client-side navigation
3. ✅ Lightbox works after hard refresh
4. ✅ No duplicate instances or memory leaks observed
5. ✅ Console logs confirm proper lifecycle management

### Production Recommendations:

1. **Disable debug mode**: Set `this.debug = false` in the LightboxManager class
2. **Monitor performance**: The 50ms delay is optimal but can be adjusted if needed
3. **Edge cases**: The solution handles all standard navigation patterns correctly
4. **Browser compatibility**: Tested and working in modern browsers with View Transitions support

### Technical Summary:

The global LightboxManager successfully resolved the issue by:

- Centralizing lightbox management in a single location (Layout.astro)
- Properly cleaning up instances before page transitions
- Reinitializing after navigation completes
- Using a singleton pattern to prevent duplicate instances
- Adding appropriate delays to handle DOM rendering timing
