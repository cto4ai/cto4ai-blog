# Option 2A Implementation Plan: Unified Content Structure

## Overview

This document outlines the implementation plan for Option 2A from the organization-of-images-and-content-types.md document. This approach creates a unified content and image structure with content types as metadata rather than directory-based organization.

## Goal

Transform the current type-based directory structure into a unified structure that:

- Prevents URL collisions
- Maintains semantic clarity through contentType metadata
- Creates parallel content and image directories
- Preserves all existing functionality

## Implementation Phases

### Phase 1: Preparation & Safety (No Breaking Changes)

#### 1.1 Create Safety Net

- Create backup branch for rollback safety
- Document all existing content files and their image dependencies
- Create inventory of:
  - All MDX/MD files and their current locations
  - All image directories and their contents
  - Current URL mappings

#### 1.2 Add ContentType Metadata

Add `contentType` to front matter of all existing MDX files (non-breaking addition):

- `/src/data/posts/*` → `contentType: "essay"`
- `/src/data/micro/*` → `contentType: "brief"`
- `/src/data/elsewhere/*` → `contentType: "elsewhere"`
- `/src/data/quote/*` → `contentType: "quote"`

#### 1.3 Validation

- Test that site builds successfully with new front matter
- Verify all pages render correctly
- Confirm no functionality is broken

### Phase 2: Create New Structure (Parallel to Existing)

#### 2.1 Create Directory Structure

```
/src/data/content/          # New unified content directory
/src/assets/images/content/ # New unified images directory
```

#### 2.2 Update Components for Dual Support

Modify `SingleImage` and `ImageGallery` components to:

- Check new path first (`/assets/images/content/{postDir}/`)
- Fall back to old path (`/assets/images/blog/{postDir}/`)
- Maintain backward compatibility

Example fallback logic:

```typescript
// Try new path
let imagePath = `/assets/images/content/${postDir}/${src}`;
if (!fileExists(imagePath)) {
  // Fall back to old path
  imagePath = `/assets/images/blog/${postDir}/${src}`;
}
```

#### 2.3 Test Dual Support

- Verify components work with both old and new structures
- Test with sample content in new location
- Ensure no regression in existing content

### Phase 3: Migration Script

#### 3.1 Create Migration Script

Develop script that:

- **Input**: Current file path
- **Output**: New unified structure

Migration logic:

```
For each content file:
1. Extract slug from filename or front matter
2. Create {postDir} = slug
3. Move content:
   /src/data/{type}/{filename}.mdx → /src/data/content/{postDir}/index.mdx
4. Move images:
   /src/assets/images/blog/{postDir}/* → /src/assets/images/content/{postDir}/*
5. Record in migration map for rollback
```

#### 3.2 Migration Map Structure

```json
{
  "content": {
    "original": "/src/data/posts/my-post.mdx",
    "new": "/src/data/content/my-post/index.mdx",
    "contentType": "essay"
  },
  "images": {
    "original": "/src/assets/images/blog/my-post/",
    "new": "/src/assets/images/content/my-post/"
  }
}
```

#### 3.3 Test Migration

- Run on subset (5-10 posts) first
- Verify content renders correctly
- Check image paths resolve
- Test rollback procedure

#### 3.4 Execute Full Migration

- Run in batches by content type
- Verify each batch before proceeding
- Keep detailed logs of all operations

### Phase 4: Update References

#### 4.1 Update Content Collections

- Modify Astro content collections to read from `/src/data/content/`
- Update collection schemas if needed
- Ensure contentType is properly exposed

#### 4.2 Update Build Configuration

- Update any build scripts
- Modify path references in config files
- Update import paths in components

#### 4.3 Update Routing

- Ensure URL generation uses new structure
- Verify all routes resolve correctly
- Test navigation between content types

#### 4.4 Comprehensive Testing

- Test all content types render
- Verify all images load
- Check responsive images work
- Test search functionality
- Validate RSS/sitemap generation

### Phase 5: Cleanup (After Verification)

#### 5.1 Remove Old Structures

After confirming everything works for 24-48 hours:

- Archive old directory structures
- Remove fallback logic from components
- Clean up migration scripts

#### 5.2 Update Documentation

- Update CLAUDE.md with new structure
- Document new contentType values
- Update README if needed
- Archive this migration plan

## Rollback Plan

### Immediate Rollback (During Migration)

1. Stop migration script
2. Use migration map to reverse operations
3. Restore from backup branch if needed

### Post-Migration Rollback

1. Revert to backup branch
2. Restore original directory structure from backup
3. Remove contentType from front matter if needed
4. Rebuild and deploy

## Success Criteria

### Functional Requirements

- [ ] All existing content accessible at same URLs
- [ ] All images load correctly
- [ ] Build succeeds without errors
- [ ] No broken links or missing images
- [ ] Content types properly identified in UI

### Performance Requirements

- [ ] Build time not significantly increased
- [ ] Page load times remain consistent
- [ ] Image optimization still works

### Quality Requirements

- [ ] No console errors in browser
- [ ] All tests pass
- [ ] Lighthouse scores maintained
- [ ] SEO metadata preserved

## Risk Mitigation

### High Risk Areas

1. **URL Changes**: Mitigated by maintaining same slug structure
2. **Image Path Breakage**: Mitigated by fallback logic
3. **Build Failures**: Mitigated by phased approach
4. **Data Loss**: Mitigated by backups and migration map

### Monitoring During Migration

- Watch build logs for errors
- Monitor 404s for missing resources
- Check browser console for issues
- Verify image loading in network tab

## Timeline Estimate

- Phase 1: 2-3 hours (mostly automated)
- Phase 2: 3-4 hours (component updates and testing)
- Phase 3: 4-6 hours (script development and testing)
- Phase 4: 2-3 hours (configuration updates)
- Phase 5: 1-2 hours (cleanup and documentation)

**Total: 12-18 hours** spread over multiple sessions for safety

## Next Steps

1. Review and approve this plan
2. Create backup branch
3. Begin Phase 1 implementation
4. Schedule dedicated time for migration
5. Prepare rollback procedures

## Notes

- Consider doing this migration during low-traffic period
- Have staging environment ready for testing
- Keep stakeholders informed of progress
- Document any deviations from plan
