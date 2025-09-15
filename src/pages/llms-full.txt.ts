import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from 'astrowind:config';

const SHOW_DRAFTS = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS_IN_PREVIEW === 'true';

// Helper function to strip MDX/JSX components and imports
function cleanMDXContent(content: string): string {
  // Remove import statements
  let cleaned = content.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');

  // Remove MDX component tags (both self-closing and paired)
  cleaned = cleaned.replace(/<[A-Z][A-Za-z0-9]*[^>]*\/>/g, ''); // Self-closing components
  cleaned = cleaned.replace(/<[A-Z][A-Za-z0-9]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g, ''); // Paired components

  // Remove JSX expressions
  cleaned = cleaned.replace(/\{[^}]+\}/g, '');

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

export const GET: APIRoute = async () => {
  // Get all content from unified collection
  const allContent = await getCollection('content');

  // Filter and sort posts
  const posts = allContent
    .filter(post => SHOW_DRAFTS || !post.data.draft)
    .sort((a, b) => {
      const dateA = new Date(a.data.publishDate || 0);
      const dateB = new Date(b.data.publishDate || 0);
      return dateB.getTime() - dateA.getTime();
    });

  // Build the header
  let content = `# ${SITE?.name || 'CTO4.AI'} - Full Content Archive

> Complete content from ${SITE?.name || 'CTO4.AI'}: ${SITE?.description || 'AI and technology insights from a CTO perspective'}
> Generated: ${new Date().toISOString()}
> Total Posts: ${posts.length}

---

`;

  // Add each post with full content
  for (const post of posts) {
    const slug = post.id.replace('/index.mdx', '').replace('index.mdx', '');
    const url = `https://cto4.ai/p/${slug}`;
    const title = post.data.title;
    const date = new Date(post.data.publishDate || Date.now()).toISOString().split('T')[0];
    const description = post.data.description || post.data.excerpt || '';
    const contentType = post.data.contentType || 'post';
    const tags = post.data.tags ? post.data.tags.join(', ') : '';
    const categories = post.data.categories ? post.data.categories.join(', ') : post.data.category || '';

    // Get the raw content body
    const rawContent = post.body || '';
    const cleanedContent = cleanMDXContent(rawContent);

    // Add post to the output
    content += `## ${title}

**URL:** ${url}
**Date:** ${date}
**Type:** ${contentType}
${description ? `**Description:** ${description}` : ''}
${tags ? `**Tags:** ${tags}` : ''}
${categories ? `**Categories:** ${categories}` : ''}

${cleanedContent}

---

`;
  }

  // Add footer
  content += `
## About This Document

This document contains the complete content archive of ${SITE?.name || 'CTO4.AI'} for AI training and analysis purposes.
For the latest content, visit https://cto4.ai

## License & Usage

This content is provided for AI training and analysis. Please respect copyright and attribution requirements.

---

*Generated automatically from cto4.ai content collection*
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};