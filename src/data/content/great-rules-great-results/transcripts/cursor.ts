export const cursorTranscript = `# Cursor Conversation
_Cursor session from 11/17/2025_

---

**User**

OK, let's scaffold a post titled "OMG Dharmesh!" of content type episode that's a commentary on the Latent Space podcast episode with Dharmesh Shah

---

**Cursor**

I'll scaffold a new post for your commentary on the Latent Space podcast episode with Dharmesh Shah. Let me create the directory structure and initial MDX file based on your content authoring guidelines.

Now let me create the index.mdx file with proper frontmatter. Based on your authoring guidelines, I'll set the date to 2 hours ago and mark it as draft initially:

\`\`\`markdown
---
title: "OMG Dharmesh!"
contentType: "episode"
description: "My commentary on the Latent Space podcast episode with HubSpot's Dharmesh Shah"
author: "Jack Ivers"
publishDate: "2025-01-28T06:24:00-06:00"
draft: true
tags: ["ai", "hubspot", "dharmesh-shah", "latent-space"]
categories: ["AI", "Technology"]
---

import SingleImage from '~/components/ui/SingleImage.astro';
import ImageGallery from '~/components/ui/ImageGallery.astro';

## The Episode

[Latent Space podcast episode with Dharmesh Shah](link-to-episode-here)

## My Commentary

[Your commentary here]

\`\`\`

Perfect! I've successfully scaffolded your new post "OMG Dharmesh!" Here's what I've created:

## Directory Structure Created:
- **Content**: \`/src/data/content/omg-dharmesh/index.mdx\`
- **Images**: \`/src/assets/images/content/omg-dharmesh/\` (ready for any images you want to add)
- **Social Media**: 
  - \`/src/data/content/omg-dharmesh/socialposts/images/\`
  - \`/src/data/content/omg-dharmesh/socialposts/linkedin/post.txt\`
  - \`/src/data/content/omg-dharmesh/socialposts/mastodon/post.txt\`

## The MDX File:
- **Content Type**: Set to "episode" as requested
- **Draft Status**: Set to \`draft: true\` (following your guidelines)
- **Date**: Set to 2 hours ago (2025-01-28T06:24:00-06:00)
- **Components**: Includes the required SingleImage and ImageGallery imports
- **Tags**: Added relevant tags including "latent-space", "dharmesh-shah", "hubspot"
- **Structure**: Basic structure with placeholders for the episode link and your commentary

The post is now ready for you to add your commentary content! You can:
1. Replace the placeholder episode link
2. Add your commentary in the designated section
3. Add any images to the images directory and reference them using the SingleImage or ImageGallery components
4. When ready to publish, change \`draft: false\`

The social media directories are also ready for when you want to create LinkedIn and Mastodon versions of your post.`;