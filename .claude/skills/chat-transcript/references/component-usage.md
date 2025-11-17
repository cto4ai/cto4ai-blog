# ChatTranscript Component Usage

## Component Props

| Prop             | Type    | Default       | Description                                                 |
| ---------------- | ------- | ------------- | ----------------------------------------------------------- |
| `transcript`     | string  | required      | The transcript text from TypeScript file                    |
| `theme`          | string  | 'adium'       | Options: 'adium', 'minimal', 'modern', 'compact'            |
| `maxHeight`      | string  | -             | Container height (e.g., '600px') for scrollable transcripts |
| `showTimestamps` | boolean | false         | Display message timestamps                                  |
| `showAvatars`    | boolean | true          | Show user/AI avatars                                        |
| `showSource`     | boolean | true          | Show transcript source info                                 |
| `collapsible`    | boolean | false         | Make long messages collapsible                              |
| `toolName`       | string  | auto-detected | Manual override for AI tool name display                    |

## Theme Options

### adium

Nostalgic chat bubble style inspired by the classic Adium messenger. Best for fun, conversational posts.

### minimal

Clean, simple design with subtle borders. Best for professional, technical content.

### modern

Contemporary design with shadows and modern styling. Best for polished, production-quality posts.

### compact

Dense layout with minimal spacing. Best for embedding multiple short conversations.

## Usage Examples

### Single Transcript - Basic

```mdx
import ChatTranscript from '~/components/ui/ChatTranscript.astro';
import { claudeCodeChat } from './transcripts/claude-code';

## My Conversation

<ChatTranscript transcript={claudeCodeChat} theme="adium" maxHeight="600px" />
```

### Multiple Transcripts - Comparing Tools

```mdx
import ChatTranscript from '~/components/ui/ChatTranscript.astro';
import { claudeCodeChat } from './transcripts/claude-code';
import { cursorChat } from './transcripts/cursor';
import { chatGptChat } from './transcripts/chatgpt';

## Claude Code Approach

<ChatTranscript transcript={claudeCodeChat} theme="adium" maxHeight="500px" />

## Cursor Alternative

<ChatTranscript transcript={cursorChat} theme="minimal" maxHeight="500px" />

## ChatGPT Solution

<ChatTranscript transcript={chatGptChat} theme="modern" maxHeight="500px" />
```

### With Tool Name Override

Use when you want to specify the exact model or brand name:

```mdx
<ChatTranscript transcript={claudeCodeChat} theme="adium" maxHeight="600px" toolName="Claude 3.5 Sonnet" />
```

**Common override scenarios:**

- Specify exact model version: `toolName="Claude 3.5 Sonnet"`
- More descriptive naming: `toolName="Cursor IDE"`
- Model specification: `toolName="GPT-4"`

### Short Inline Transcript (No Conversion)

For very short conversations, embed directly without conversion:

```mdx
import ChatTranscript from '~/components/ui/ChatTranscript.astro';

<ChatTranscript theme="compact">
{`**User**

How do I center a div?

---

**Assistant**

Use flexbox: \`display: flex; justify-content: center; align-items: center;\`

Or CSS Grid: \`display: grid; place-items: center;\``}

</ChatTranscript>
```

## Best Practices

### Performance

- Use `maxHeight` for long conversations to avoid excessive scrolling
- Import from TypeScript files (not inline) for better build performance
- Consider splitting very long conversations into multiple sections

### Readability

- Choose appropriate theme for content type:
  - `adium` for nostalgic/fun posts
  - `minimal` or `modern` for technical content
  - `compact` for dense information
- Add context before/after transcripts in your post
- Use descriptive headings to introduce each transcript

### Export Names

- Use descriptive camelCase names matching conversation topic
- Examples: `authImplementation`, `debugSession`, `featureDiscussion`
- Be consistent across multiple transcripts in same post

### Tool Name Override

- Override when auto-detection isn't accurate
- Use for better branding (e.g., "Claude 3.5 Sonnet" vs "Claude Code")
- Helpful when transcript source metadata is missing or incorrect
