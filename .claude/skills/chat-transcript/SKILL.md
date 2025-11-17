---
name: chat-transcript
description: Convert AI chat transcripts from various sources (Claude Code, Cursor, Claude.ai, ChatGPT) to TypeScript and embed them in cto4.ai blog posts using the ChatTranscript component. Use when adding AI conversation transcripts to blog posts or when user has exported chat sessions to include in content.
---

# Chat Transcript Integration

## Purpose

This skill handles the complete workflow for converting AI chat transcripts and displaying them in MDX blog posts. It covers transcript conversion from multiple AI tools to TypeScript format, proper file organization, and integration using the ChatTranscript component.

## When to Use This Skill

Use this skill when:

- User has an AI chat transcript to add to a blog post (from Claude Code, Cursor, Claude.ai, or ChatGPT)
- User requests to "add this conversation to my post"
- User wants to convert or display AI chat transcripts
- Setting up transcript directories for new posts
- Troubleshooting transcript display issues

## Complete Workflow

### Step 1: Identify Transcript Source

Examine the transcript file to determine format:

- **Claude Code**: Contains `/export` command output or "from Claude Code"
- **Cursor**: Contains "from Cursor" or Cursor export markers
- **Claude.ai**: Has `Human:` and `Assistant:` format
- **ChatGPT**: Has `User:` and `ChatGPT:` or `Assistant:` format

### Step 2: Create Directory Structure

For a post with slug `{slug}`:

```bash
mkdir -p src/data/content/{slug}/transcripts
```

### Step 3: Convert Transcript to TypeScript

Use the existing Python converter (auto-detects format):

```bash
python3 scripts/convert-chat-transcript.py \
  ~/Downloads/exported-chat.md \
  src/data/content/{slug}/transcripts/chat-name.ts \
  --export-name descriptiveName
```

**Key Parameters:**

- Input: Path to raw transcript file (any supported format)
- Output: Path for TypeScript file (always in `transcripts/` subdirectory)
- `--export-name`: Descriptive camelCase name (e.g., `featureImplementation`, `debuggingSession`)

**Naming Conventions:**

- File names: `claude-code.ts`, `cursor.ts`, `claude-ai.ts`, `chatgpt.ts`
- Export names: Match conversation topic descriptively

### Step 4: Add to MDX File

Import and use the ChatTranscript component:

```mdx
import ChatTranscript from '~/components/ui/ChatTranscript.astro';
import { conversationName } from './transcripts/chat-name';

<ChatTranscript transcript={conversationName} theme="adium" maxHeight="600px" />
```

For detailed component props, themes, and examples, consult `references/component-usage.md`.

## Key Non-Obvious Patterns

- **Auto-detection**: Converter automatically detects transcript format - no manual format specification needed
- **TypeScript escaping**: Converter handles backtick and special character escaping for TypeScript compatibility
- **Transcript directory**: Always use `transcripts/` subdirectory within post directory (parallel to `index.mdx`)
- **File paths**: Transcripts use relative imports (`./transcripts/`) since they're in post directory
- **Tool name override**: Use `toolName` prop when auto-detection is inaccurate or you want specific branding

## Troubleshooting

For common issues with converter or component display, consult `references/troubleshooting.md`.

## Resources

### Project Scripts

This skill references an existing project script (not bundled with skill):

- `scripts/convert-chat-transcript.py` - Converts raw transcripts to TypeScript format with auto-detection

### references/

- `component-usage.md` - ChatTranscript component props, themes, and usage examples
- `troubleshooting.md` - Common issues and solutions for conversion and display
