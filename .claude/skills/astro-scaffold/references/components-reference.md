# Component Reference Guide

Detailed documentation for technical components used in cto4.ai blog posts.

## SingleImage Component

Display individual images with lightbox support.

### Usage

```jsx
import SingleImage from '~/components/ui/SingleImage.astro';

<SingleImage
  src="image-filename.png"
  alt="Descriptive alt text for accessibility"
  size="2xl"
  postDir="your-post-slug"
/>;
```

### Parameters

- **src** (required): Image filename (not full path)
- **alt** (required): Descriptive alt text for accessibility
- **size** (required): Image size - options: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `full`
- **postDir** (required): Post slug matching the directory name

### Image Path Resolution

The component automatically looks for images in `/src/assets/images/content/{postDir}/`.

Example: If `postDir="my-post"` and `src="diagram.png"`, the component loads from `/src/assets/images/content/my-post/diagram.png`.

### Best Practices

- Always provide descriptive alt text for accessibility
- Use descriptive filenames (not IMG_1234.jpg)
- Optimize images before upload (compress, appropriate dimensions)
- Place all images in the post's dedicated image directory

## ImageGallery Component

Display multiple images in a grid with lightbox support.

### Usage

```jsx
import ImageGallery from '~/components/ui/ImageGallery.astro';

<ImageGallery images={['image1.png', 'image2.jpg', 'image3.webp']} postDir="your-post-slug" size="xl" />;
```

### Parameters

- **images** (required): Array of image filenames
- **postDir** (required): Post slug matching the directory name
- **size** (required): Display size - same options as SingleImage

### Example

```jsx
<ImageGallery images={['screenshot1.png', 'screenshot2.png', 'screenshot3.png']} postDir="quick-update" size="lg" />
```

## ChatTranscript Component

Display AI conversation transcripts with syntax highlighting and formatting.

### Usage

```jsx
import ChatTranscript from '~/components/ui/ChatTranscript.astro';
import { myConversation } from './transcripts/claude-code';

<ChatTranscript transcript={myConversation} theme="adium" maxHeight="600px" toolName="Claude Code" />;
```

### Parameters

- **transcript** (required): Imported transcript object from TypeScript file
- **theme** (optional): Visual theme - options: `adium`, `minimal`, `modern`, `compact`
- **maxHeight** (optional): Container height (e.g., '600px') for scrollable transcripts
- **toolName** (optional): Override auto-detected AI tool name
- **showTimestamps** (optional): Display message timestamps (default: false)
- **showAvatars** (optional): Show user/AI avatars (default: true)

### Preparing Transcripts

1. Export AI chat conversation to file
2. Convert to TypeScript using `convert-chat-transcript.py` script:
   ```bash
   python3 scripts/convert-chat-transcript.py path/to/export.txt > src/data/content/{slug}/transcripts/chat-export.ts
   ```
3. Import and use in MDX:
   ```jsx
   import { conversation } from './transcripts/chat-export';
   ```

### Storage Location

Store transcript TypeScript files in: `/src/data/content/{slug}/transcripts/`

## MDContent Component

Embed external Markdown files with styled sections.

### Usage

```jsx
import MDContent from '~/components/ui/MDContent.astro';
import { Content as Part1Content } from './embedded/part1.md';

<MDContent
  title="Section Title"
  Content={Part1Content}
  description="Optional description for this section"
  className="custom-classes"
/>;
```

### Parameters

- **title** (required): Section heading
- **Content** (required): Imported Content component from a Markdown file
- **description** (optional): Subtitle or description text
- **className** (optional): Additional CSS classes

### Embedding Patterns

#### 1. Post-Specific Sections (Recommended)

For long-form content sections:

```jsx
import { Content as SectionContent } from './embedded/section.md';

<MDContent title="Technical Deep Dive" Content={SectionContent} description="Detailed technical analysis" />;
```

#### 2. Site-Wide Content

For shared content like privacy policies:

```jsx
import { Content as Privacy } from '~/privacy-policy.md';

<Privacy />;
```

#### 3. Multiple Sections Pattern

For complex posts with multiple embedded sections:

```jsx
import { Content as Part1 } from './embedded/part1.md';
import { Content as Part2 } from './embedded/part2.md';
import { Content as Appendix } from './embedded/appendix.md';

<MDContent title="Part 1: Introduction" Content={Part1} />
<MDContent title="Part 2: Deep Dive" Content={Part2} />
<MDContent title="Appendix" Content={Appendix} />
```

### Storage Location

Store embedded Markdown files in: `/src/data/content/{slug}/embedded/`

## Hyperlinking

### External Links

Standard markdown syntax:

```markdown
[Link Text](https://example.com)
```

### Internal Blog Links

Use relative paths from root:

```markdown
[My other post](/p/other-post-slug)
[Posts by tag](/tag/ai)
[Posts by category](/category/technology)
```

### Footnotes

MDX supports footnotes:

```markdown
This needs a citation[^1].

[^1]: This is the footnote content.
```

## Troubleshooting

### Images Not Showing

- Check image is in correct directory: `/src/assets/images/content/{slug}/`
- Verify `postDir` parameter matches slug exactly
- Ensure image filename matches reference exactly (case-sensitive)

### Build Errors

- Validate frontmatter YAML syntax
- Check all imported components exist
- Ensure JSX syntax is valid
- Verify date format is correct

### Links Not Working

- Internal links should start with `/`
- Test all links with dev server running
- Check for typos in slugs

### Component Import Errors

- Verify component paths use `~/` prefix for root imports
- Check that relative imports (e.g., `./embedded/file.md`) are correct
- Ensure imported Markdown files exist at specified paths
