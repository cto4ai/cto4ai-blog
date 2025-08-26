# Snipd Quote Transformation Rule

## Purpose
Transform Snipd app quotes into clean, consistent markdown format for blog posts.

## Transformation Steps

When encountering a Snipd quote in this format:
```
"Quote text here"

― [Person] on [topic description]

Heard on [Podcast/Source]: [Additional context].
https://share.snipd.com/episode/[episode-id]

Snipd - save & remember the best insights you hear in podcasts
```

Transform it to:
```
On [[topic description]](https://share.snipd.com/episode/[episode-id]):

> Quote text here
```

## Specific Rules

1. **Quote formatting**: 
   - Remove the surrounding quotes from the original quote text
   - Convert to markdown blockquote using `>`

2. **Topic line**: 
   - Remove "― [Person] " from the beginning
   - Capitalize "On" at the start
   - Add a colon `:` at the end
   - Hyperlink the topic description to the share.snipd.com URL

3. **Remove lines**:
   - Remove the "Heard on [Podcast/Source]: ..." line completely
   - Remove the "Snipd - save & remember..." promotional line completely

## Example

**Before:**
```
"When the models are extremely capable, the value of a token they generate is extremely high."

― Greg Brockman on why online learning and RL amplify model value

Heard on Latent Space: The AI Engineer Podcast - Greg Brockman on OpenAI's Road to AGI.
https://share.snipd.com/episode/8dd5816c-f788-446e-9a8b-679b141718ce

Snipd - save & remember the best insights you hear in podcasts
```

**After:**
```
On [why online learning and RL amplify model value](https://share.snipd.com/episode/8dd5816c-f788-446e-9a8b-679b141718ce):

> When the models are extremely capable, the value of a token they generate is extremely high.
```

## Notes
- Preserve the exact topic description from the original attribution line
- Maintain the share.snipd.com URL for proper attribution
- Result should be clean and professional without promotional text
