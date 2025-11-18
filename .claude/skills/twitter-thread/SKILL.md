---
name: twitter-thread
description: This skill should be used when creating Twitter threads from LinkedIn plain posts. Converts LinkedIn content to 3-6 tweet threads (under 280 chars each), writes to socialposts/twitter/thread.txt, and handles file versioning.
---

# Twitter Thread Creation

## Purpose

Convert LinkedIn plain posts into Twitter threads optimized for engagement. Transform the LinkedIn content into 3-6 concise tweets while maintaining the plainspoken Ethan Mollick style and core message flow.

## When to Use This Skill

This skill should be used when:

- Creating a Twitter thread from a LinkedIn post
- User requests "make a Twitter version" or "create a thread"
- Repurposing LinkedIn content for Twitter distribution
- User needs multiple thread variations from the same LinkedIn post

## How to Use This Skill

### Workflow Overview

1. **Identify source content**:
   - Primary source: `src/data/content/{slug}/socialposts/linkedin/plain-post.txt`
   - Reference: `src/data/content/{slug}/index.mdx` (for canonical URL)

2. **Extract key information**:
   - Read LinkedIn plain post as primary source material
   - Extract canonical URL from MDX frontmatter: `https://cto4.ai/p/{slug}`
   - Identify core message and flow from LinkedIn content

3. **Break content into tweets** (3-6 tweets):
   - Each tweet must be under 280 characters (including spaces)
   - Transform LinkedIn paragraphs into concise, punchy statements
   - Maintain core message and flow from LinkedIn post
   - Final tweet contains only the canonical URL
   - For detailed threading strategy and examples, consult `references/thread-style-guide.md`

4. **Format the thread**:

   ```text
   TWEET 1:
   [content]

   TWEET 2:
   [content]

   TWEET 3:
   [content]

   https://cto4.ai/p/{slug}
   ```

5. **Save to file**:
   - Ensure directory exists: `mkdir -p src/data/content/{slug}/socialposts/twitter/`
   - File naming: `thread.txt` (first), `thread-2.txt`, `thread-3.txt` (subsequent)
   - **Never overwrite** - check for existing files and increment number
   - Format: Plain text, Unix line endings (LF), UTF-8 encoding

### Key Details

- **Character limits**: Each tweet under 280 chars (URLs count as ~23 chars when shortened by Twitter)
- **Style consistency**: Use same plainspoken tone as LinkedIn post (no emojis, no hashtags)
- **Natural condensation**: Thread should feel like a natural adaptation of LinkedIn content, not a new take
- **Tweet independence**: Each tweet should stand alone but flow naturally in sequence
- **Punctuation**: Use em dashes (—) not hyphens for clarity

### Testing Checklist

Before finalizing, verify:

1. Each tweet is under 280 characters
2. Thread has 3-6 tweets total
3. No emojis or hashtags present
4. Plainspoken, punchy style maintained
5. Core message from LinkedIn post preserved
6. Final tweet contains only URL
7. Unix line endings (LF)
8. File increment logic applied correctly

## Resources

### references/

- `thread-style-guide.md` - Detailed thread examples, character counting rules, and style guidelines
