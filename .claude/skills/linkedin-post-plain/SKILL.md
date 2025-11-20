---
name: linkedin-post-plain
description: This skill should be used when creating plain-formatted LinkedIn posts from Astro MDX blog content. Drafts posts in Ethan Mollick's plainspoken style (500-1000 chars), writes to socialposts/linkedin/plain-post.txt, and handles file versioning.
---

# LinkedIn Plain Post Creation

## Purpose

Convert Astro MDX blog posts into plain-formatted LinkedIn posts optimized for engagement. Generate professional, plainspoken content in Ethan Mollick's style without emojis or hashtags.

## When to Use This Skill

This skill should be used when:

- Creating a LinkedIn post from a blog post
- Drafting social media promotion for blog content
- Generating multiple LinkedIn variations from the same post
- User requests "draft a LinkedIn version" or similar phrasing

## How to Use This Skill

### Workflow Overview

1. **Identify source content** - Read `src/data/content/{slug}/index.mdx` (full post or user-selected section)

2. **Extract key information**:
   - Frontmatter: `title`, `description`, `publishDate`, `tags` (optional)
   - Body content: Main insights and substantive points
   - Canonical URL: `https://cto4.ai/p/{slug}`

3. **Draft LinkedIn post** following format requirements:
   - Length: 500-1000 characters (LinkedIn engagement sweet spot)
   - Style: Plainspoken, conversational (Ethan Mollick tone)
   - No emojis, no hashtags, no inline images
   - **No URLs in post body** - LinkedIn's algorithm deprioritizes posts with links
     - This includes anything that looks like a URL (e.g., "Claude.ai" triggers this)
     - Use "Claude web" or "Claude Desktop" instead of "Claude.ai"
     - The blog link goes in a separate comment, not inline
   - Focus on insight, not self-promotion
   - For detailed style guidance, consult `references/style-guide.md`

4. **Structure the output**:

   ```text
   [LinkedIn post text]

   ---

   https://cto4.ai/p/{slug}
   ```

   Note: Link posted as separate comment, not inline

5. **Save to file**:
   - Ensure directory exists: `mkdir -p src/data/content/{slug}/socialposts/linkedin/`
   - File naming: `plain-post.txt` (first), `plain-post-2.txt`, `plain-post-3.txt` (subsequent)
   - **Never overwrite** - check for existing files and increment number
   - Format: Plain text, Unix line endings (LF), UTF-8 encoding

### Key Details

- **Frontmatter priority**: `title` and `description` are critical inputs - they often contain the core insight
- **Content strategy**: Draw from both frontmatter and body; start with compelling hook; end with thought-provoking statement
- **socialposts directory**: For planning only, never published to the live site
- **Character count**: Verify post length is within 500-1000 character range

### Testing Checklist

Before finalizing, verify:

1. Character count within 500-1000 range
2. No emojis or hashtags present
3. **No URLs or URL-like text in post body** (e.g., avoid "Claude.ai", use "Claude web")
4. Plainspoken, scannable structure
5. Compelling hook at start
6. Unix line endings (LF)
7. File increment logic applied correctly

## Resources

### references/

- `style-guide.md` - Ethan Mollick style examples, tone guidelines, and content strategy details
