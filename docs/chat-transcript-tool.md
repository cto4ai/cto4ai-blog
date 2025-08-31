# ChatTranscript Tool - Usage Guide

A comprehensive guide for using the ChatTranscript component and converter tools to display AI conversation transcripts in your blog posts.

## Overview

The ChatTranscript tool allows you to easily display AI conversation transcripts from various sources (Claude Code, Cursor, Claude.ai, ChatGPT) in your MDX blog posts with an attractive Adium-style chat interface.

## Getting Your Chat Transcript

### From Claude Code
1. Type `/export` in your Claude Code chat
2. This creates a markdown file with the entire conversation
3. Save the file to your project

### From Cursor
1. Use Cursor's export feature (usually in the chat menu)
2. Save the exported markdown file
3. The format is similar to Claude Code exports

### From Claude.ai
1. Copy the conversation from the web interface
2. Paste into a text file
3. Save with `.txt` or `.md` extension

### From ChatGPT
1. Use the share/export feature
2. Copy the conversation text
3. Save to a file

## Converting Transcripts with the Python Script

### Basic Usage

```bash
python3 scripts/convert-chat-transcript.py input.txt output.ts --export-name myTranscript
```

### Examples

Convert a Claude Code export:
```bash
python3 scripts/convert-chat-transcript.py ~/Downloads/claude-chat.txt src/data/content/my-post/chat-transcript.ts --export-name claudeChat
```

Convert a Cursor export:
```bash
python3 scripts/convert-chat-transcript.py cursor-export.md src/data/content/my-post/cursor-transcript.ts --export-name cursorChat
```

### What the Script Does
- Auto-detects the format (Claude Code, Cursor, Claude.ai, ChatGPT)
- Cleans up formatting and special characters
- Properly escapes backticks for TypeScript template literals
- Creates a TypeScript file ready to import into your MDX

## Using in MDX Blog Posts

### Option A: Import from TypeScript File (Recommended for Long Transcripts)

```mdx
---
title: "My Post Title"
description: "Post description"
author: "Your Name"
publishDate: "2025-08-31T10:00:00-05:00"
---

import ChatTranscript from '~/components/ui/ChatTranscript.astro';
import { myTranscript } from './my-transcript.ts';

## My Section

Here's my conversation with Claude about implementing this feature:

<ChatTranscript transcript={myTranscript} theme="adium" maxHeight="600px" />
```

### Option B: Inline in MDX (Good for Short Transcripts)

```mdx
import ChatTranscript from '~/components/ui/ChatTranscript.astro';

## Quick Example

<ChatTranscript theme="adium" maxHeight="400px">
{`**User**

How do I create a function in Python?

---

**Assistant**

Here's how to create a function in Python:

\`\`\`python
def my_function():
    print("Hello, World!")
\`\`\`

You can call it with \`my_function()\`.`}
</ChatTranscript>
```

### Option C: Multiple Transcripts in One Post

```mdx
import ChatTranscript from '~/components/ui/ChatTranscript.astro';
import { cursorTranscript } from './cursor-transcript.ts';
import { claudeCodeTranscript } from './claude-code-transcript.ts';

## Comparing Different AI Tools

### Using Cursor

<ChatTranscript transcript={cursorTranscript} theme="adium" maxHeight="500px" />

### Using Claude Code

<ChatTranscript transcript={claudeCodeTranscript} theme="minimal" maxHeight="500px" />
```

## Component Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `transcript` | string | - | The transcript text to display |
| `messages` | ChatMessage[] | - | Pre-parsed messages array (alternative to transcript) |
| `theme` | 'adium' \| 'minimal' \| 'modern' \| 'compact' | 'adium' | Visual theme for the chat UI |
| `showTimestamps` | boolean | false | Show/hide message timestamps |
| `showAvatars` | boolean | true | Show/hide avatar icons |
| `showSource` | boolean | true | Show source info (e.g., "Claude Code") |
| `collapsible` | boolean | false | Make long messages collapsible |
| `maxHeight` | string | - | Set max height with scroll (e.g., "600px") |

## Complete Workflow Example

Let's say you just had a conversation with Claude Code about implementing a new feature:

### Step 1: Export the Chat
Type `/export` in Claude Code. This saves a file like `claude-code-2025-08-31.md`.

### Step 2: Create Your Blog Post Directory
```bash
mkdir -p src/data/content/feature-implementation
```

### Step 3: Convert the Transcript
```bash
python3 scripts/convert-chat-transcript.py \
  ~/Downloads/claude-code-2025-08-31.md \
  src/data/content/feature-implementation/transcript.ts \
  --export-name featureDiscussion
```

### Step 4: Create Your Blog Post
Create `src/data/content/feature-implementation/index.mdx`:

```mdx
---
title: "Implementing Authentication with Claude Code"
contentType: "essay"
description: "A walkthrough of implementing JWT authentication with AI assistance"
author: "Your Name"
publishDate: "2025-08-31T10:00:00-05:00"
draft: false
tags: ["claude-code", "authentication", "ai-assisted-development"]
categories: ["Development", "AI"]
---

import ChatTranscript from '~/components/ui/ChatTranscript.astro';
import { featureDiscussion } from './transcript.ts';

Today I used Claude Code to help implement JWT authentication in our app. 
Here's the complete conversation showing how we approached it:

<ChatTranscript 
  transcript={featureDiscussion} 
  theme="adium" 
  maxHeight="600px" 
/>

## Key Takeaways

The AI helped identify several important security considerations...
```

### Step 5: View Your Post
Navigate to `http://localhost:4321/p/feature-implementation` to see your post with the embedded chat transcript.

## Tips and Best Practices

### Performance
- Use `maxHeight` for long conversations to avoid huge scrolling pages
- Consider breaking very long conversations into multiple smaller transcripts
- Import from TypeScript files rather than inline for better build performance

### Styling
- The `adium` theme provides the classic chat bubble look
- Use `minimal` theme for a cleaner, more modern appearance
- The `compact` theme works well for code-heavy conversations
- All themes support both light and dark modes automatically

### Content
- The parser preserves code blocks with syntax highlighting
- Markdown formatting within messages is preserved
- Links in transcripts remain clickable
- Special characters are properly escaped

### Organization
- Keep transcript files in the same directory as your post
- Use descriptive export names that indicate the conversation topic
- Consider creating a `transcripts/` subdirectory for posts with multiple conversations

## Troubleshooting

### Syntax Errors in TypeScript Files
If you get syntax errors after conversion:
1. Check for unescaped backticks - the converter should handle these, but complex nested code blocks can sometimes cause issues
2. Try re-running the converter with the latest version of the script
3. Manually check the generated TypeScript file for any obvious issues

### Transcript Not Displaying
1. Ensure you've imported both the component and the transcript
2. Check that the export name matches what you're importing
3. Verify the transcript prop is being passed correctly

### Format Not Detected
If the converter can't auto-detect the format:
1. Check that the transcript includes typical markers (e.g., "**User**", "**Assistant**")
2. You can force a specific format with the `--format` flag (though auto-detect usually works)
3. Ensure the file is saved with UTF-8 encoding

### Styling Issues
1. Make sure you're using a valid theme name
2. Check that Tailwind CSS is properly configured in your project
3. Clear your browser cache if styles aren't updating

## Advanced Usage

### Custom Parsing
If you need to pre-process transcripts in a specific way, you can create custom TypeScript files:

```typescript
export const myCustomTranscript = `# Custom Chat
_Special formatting here_

---

**User**
My question with [[special markup]]

---

**Assistant**
Response with custom formatting
`.replace(/\[\[(.*?)\]\]/g, '<mark>$1</mark>');
```

### Extending the Converter
The Python converter script is designed to be extensible. You can add new converter classes for additional AI tools by:

1. Creating a new class that inherits from `TranscriptConverter`
2. Implementing the `detect()`, `convert()`, and `get_source_name()` methods
3. Adding your converter to the `TranscriptProcessor` converters list

## Resources

- [ChatTranscript Component Source](../src/components/ui/ChatTranscript.astro)
- [Converter Script](../scripts/convert-chat-transcript.py)
- [Parser Utility](../src/utils/chatTranscriptParser.ts)
- [Example Usage in Blog Post](../src/data/content/cursor-rules-for-copywriting/index.mdx)