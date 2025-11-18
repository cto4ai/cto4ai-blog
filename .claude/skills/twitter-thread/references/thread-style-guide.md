# Twitter Thread Style Guide

## Purpose

Transform LinkedIn plain posts into effective Twitter threads while maintaining the plainspoken Ethan Mollick style and core message flow.

## Core Principles

1. **Natural condensation** - Thread should feel like an adapted version of the LinkedIn post, not a completely new take
2. **Punchy brevity** - Transform LinkedIn paragraphs into concise, Twitter-friendly statements
3. **Flow maintenance** - Preserve the core message and logical progression from the LinkedIn post
4. **Tweet independence** - Each tweet should stand alone but connect naturally to the next
5. **Style consistency** - Maintain plainspoken tone: no emojis, no hashtags, no marketing speak

## Thread Structure

### Optimal Length

- **Target**: 3-6 tweets
- **Minimum**: 3 tweets (opening, development, URL)
- **Maximum**: 6 tweets (avoid overwhelming readers)

### Tweet Format

Each tweet labeled with "TWEET N:" followed by content:

```text
TWEET 1:
[Opening hook - sets up the topic]

TWEET 2:
[Development - key insight or context]

TWEET 3:
[Additional development or conclusion]

[Final tweet contains only canonical URL]
```

## Character Limits and Counting

### Twitter Character Rules

- **Hard limit**: 280 characters per tweet (including spaces)
- **URL counting**: URLs are automatically shortened by Twitter but count as ~23 characters in your draft
- **Safety margin**: Aim for 270 characters to be safe
- **Punctuation**: Em dashes (—), periods, and spaces all count

### Character Counting Strategy

1. Write tweet naturally first
2. Count total characters (including spaces)
3. If over 280: split into two tweets or rephrase more concisely
4. If under 100: consider if too sparse or if can combine with another tweet
5. Verify final count before saving

## Detailed Example Thread

### Source LinkedIn Post (for context)

```
I spent Friday night migrating my Cursor Rules to Anthropic Skills in Claude Code, and it kind of blew my mind.

The thing is, I thought I understood Skills from using Claude.ai and Desktop. But Skills in Claude Code are actually way more powerful - they have discoverability through a marketplace, shareability via git, and composability with MCP servers and slash commands.

The migration itself was harder than I expected. Claude Code's first attempt violated most of Anthropic's core principles - brevity, progressive disclosure, etc. I had to insist that it re-read the skill-creator Skill and self-critique. Give it credit though - its self-critique and rework were excellent.

I ended up creating two Skills - one for blog scaffolding, one for embedding AI chat transcripts. Then Claude and I co-authored The Compleat Guide to Skills in Claude Code, leveraging the Skills research I did before writing.

The big insight: Skills are optimized to conserve context. That alone is worth the migration, given how often context exhaustion kills productive sessions.
```

### Converted Twitter Thread

```
TWEET 1:
Simon Willison's latest on autonomous coding agents hit a nerve. I've been using Codex Cloud and Claude Code On The Web, and the shift from synchronous pairing to fire-and-forget is bigger than expected.

TWEET 2:
The key insight: these tools give us safe YOLO mode. In regular Claude Code, YOLO mode is dangerous—the agent could nuke your system drive, wipe your GitHub repo, bring down your AWS cloud. So we work in non-YOLO mode: constant supervision, endless permission-granting.

TWEET 3:
Autonomous coding agents solve this by running in sandboxed cloud environments with isolated code spaces. Fire off a task, go into a meeting, come back to a PR waiting for review. Nothing touches your real code until you explicitly merge it.

TWEET 4:
Willison uses these for code research projects—quick experiments like "could Redis work for this?" or "can I get this C extension working in WebAssembly?" The agents churn through the research and report back with working code or clear failures.

TWEET 5:
The human work shifts from constant supervision to writing clear specs. Nothing stops you from having 10 or 20 agents working in parallel except your ability to write 10 or 20 good, clear specifications.

https://cto4.ai/p/autonomous-coding-agents-fire-and-forget
```

### What Makes This Thread Work

- **Opening hook** (Tweet 1): References Simon Willison, establishes credibility and topic
- **Core insight** (Tweet 2): Introduces "safe YOLO mode" concept with concrete risks
- **Problem-solution** (Tweet 3): Shows how autonomous agents solve the safety problem
- **Concrete use case** (Tweet 4): Specific examples make it real and relatable
- **Broader implication** (Tweet 5): Connects to workflow transformation
- **URL placement**: Final tweet is just the link, clean and clear

## Style Guidelines

### Tone and Voice

**Maintain from LinkedIn post:**

- Direct and conversational
- Plainspoken language ("hit a nerve", "kind of nuts")
- Specific examples over abstract concepts
- Natural qualifiers ("I think", "it seems")

**Adapt for Twitter:**

- More concise sentences
- Stronger hooks at tweet beginnings
- Punchier conclusions
- Break long thoughts into separate tweets

### Punctuation for Twitter

- **Em dashes (—)**: Use for emphasis and breaks (not hyphens)
- **Periods**: Complete sentences, natural breaks
- **Question marks**: Sparingly, only for genuine questions
- **Ellipses (...)**: Avoid - prefer clean breaks between tweets
- **Quotation marks**: Use for direct quotes or specific terms

### What to Avoid

1. **Hashtags**: Twitter algorithm deprioritizes excessive hashtags
2. **Emojis**: Plain text only, maintains professional tone
3. **@mentions**: Unless organically part of the content
4. **Marketing language**: "game-changing", "revolutionary", "must-read"
5. **Thread hooks**: No "1/6" or "THREAD:" markers - let content speak
6. **Cliffhangers**: Each tweet should add value, not just tease

## Content Transformation Techniques

### Condensing Paragraphs to Tweets

**LinkedIn paragraph:**

```
The migration itself was harder than I expected. Claude Code's first attempt violated most of Anthropic's core principles - brevity, progressive disclosure, etc. I had to insist that it re-read the skill-creator Skill and self-critique. Give it credit though - its self-critique and rework were excellent.
```

**Twitter condensation:**

```
TWEET 3:
The migration was harder than expected. Claude Code's first attempt violated Anthropic's core principles—brevity, progressive disclosure. Had to make it re-read skill-creator and self-critique. Credit where due: its self-critique was excellent.
```

**Techniques used:**

- Removed filler words ("itself", "etc.")
- Condensed "I had to insist that it" to "Had to make it"
- Kept the human voice ("Credit where due")
- Preserved the key details and progression

### Splitting Long Ideas

If a LinkedIn paragraph has multiple ideas that can't fit in 280 chars:

**LinkedIn:**

```
Skills in Claude Code are actually way more powerful - they have discoverability through a marketplace, shareability via git, and composability with MCP servers and slash commands.
```

**Split into two tweets:**

```
TWEET 2:
Skills in Claude Code are way more powerful than I expected. They have discoverability through a marketplace and shareability via git.

TWEET 3:
The real power: composability. Skills work alongside MCP servers and slash commands, creating a full development environment.
```

### Maintaining Flow Between Tweets

Each tweet should:

1. **Connect to previous**: Use transitional language when needed
2. **Stand alone**: Make sense if read independently
3. **Lead forward**: Natural progression to next tweet
4. **Add value**: Each tweet contributes new information

**Example of good flow:**

```
TWEET 1: [Introduces problem]
TWEET 2: [Explains why problem exists - starts with "The key insight:"]
TWEET 3: [Shows solution - starts with "Autonomous coding agents solve this by..."]
TWEET 4: [Concrete example - starts with "Willison uses these for..."]
TWEET 5: [Broader implication - starts with "The human work shifts..."]
```

## Common Mistakes to Avoid

### 1. Over-compressing and Losing Voice

❌ **Too compressed:**

```
Skills > Cursor Rules. Context conservation key. Migration hard but worth it.
```

✓ **Maintains voice:**

```
I spent Friday night migrating Cursor Rules to Claude Skills, and it kind of blew my mind. The big insight: Skills are optimized to conserve context. That alone is worth the migration.
```

### 2. Adding New Content Not in LinkedIn Post

❌ **New angle:**

```
Everyone should be using Skills instead of Cursor Rules. The productivity gains are incredible.
```

✓ **Faithful to source:**

```
The migration was harder than expected, but Skills' context conservation makes it worthwhile given how often context exhaustion kills productive sessions.
```

### 3. Thread Too Long

- LinkedIn post with 5 paragraphs → 5-6 tweets max
- Don't create a tweet for every sentence
- Combine related ideas into single tweets

### 4. Tweets Too Short or Sparse

❌ **Too sparse:**

```
TWEET 1:
Skills are great.

TWEET 2:
They conserve context.
```

✓ **Substantive:**

```
TWEET 1:
I spent Friday night migrating Cursor Rules to Claude Skills. The big insight: Skills are optimized to conserve context, which matters given how often context exhaustion kills sessions.
```

## File Naming and Format

### Directory Structure

```
src/data/content/{slug}/socialposts/twitter/
├── thread.txt (first thread)
├── thread-2.txt (second variation)
└── thread-3.txt (third variation)
```

### File Format Requirements

- **Encoding**: UTF-8
- **Line endings**: Unix (LF), not Windows (CRLF)
- **Spacing**: Blank line between each tweet for readability
- **Labels**: Each tweet labeled "TWEET N:"
- **URL placement**: Final line contains only the canonical URL

### Example File Content

```text
TWEET 1:
First tweet content here.

TWEET 2:
Second tweet content here.

TWEET 3:
Third tweet content here.

https://cto4.ai/p/post-slug
```

## Versioning Strategy

When `thread.txt` exists:

1. Check for existing file: `thread.txt`
2. If exists, increment: `thread-2.txt`, `thread-3.txt`, etc.
3. Never overwrite existing threads
4. Each version can experiment with different hooks or emphasis
