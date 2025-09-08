# Content Inventory - Phase 1 Documentation

_Generated: 2025-08-24_

## Summary

- **Total Content Files**: 90 (83 MDX files based on counts)
- **Backup Branch Created**: `backup-before-option-2a`

## Content Distribution by Type

### Posts (Essay) - 32 files

Location: `/src/data/posts/`

- Future contentType: `"essay"`
- These are long-form articles

### Micro (Brief) - 19 files

Location: `/src/data/micro/`

- Future contentType: `"brief"`
- These are short-form content pieces

### Elsewhere - 26 files

Location: `/src/data/elsewhere/`

- Future contentType: `"elsewhere"`
- These are curated external content with commentary

### Quote - 6 files

Location: `/src/data/quote/`

- Future contentType: `"quote"`
- These are quotations with source attribution

## Image Directory Structure

### Active Image Directories

- `/src/assets/images/blog/` - Contains subdirectories for various posts
- `/src/assets/images/micro/` - Mostly empty, some subdirectories
- `/src/assets/images/elsewhere/` - Some content
- `/src/assets/images/quote/` - Likely empty

## Next Steps

1. Add contentType field to all MDX front matter
2. Verify no existing contentType conflicts
3. Test build after additions
4. Document any special cases or exceptions

## Notes

- All content currently accessible via `/p/[slug]` URL pattern
- Images primarily stored under `/blog/` regardless of content type
- This inventory serves as baseline for migration
