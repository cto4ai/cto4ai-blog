import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from 'astrowind:config';

const SHOW_DRAFTS = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS_IN_PREVIEW === 'true';

export const GET: APIRoute = async () => {
  // Get all content from unified collection
  const allContent = await getCollection('content');

  // Filter and sort posts
  const posts = allContent
    .filter(post => SHOW_DRAFTS || !post.data.draft)
    .sort((a, b) => {
      const dateA = new Date(a.data.publishDate || a.data.date || 0);
      const dateB = new Date(b.data.publishDate || b.data.date || 0);
      return dateB.getTime() - dateA.getTime();
    });

  // Get recent posts (top 30)
  const recentPosts = posts.slice(0, 30);

  // Group posts by content type
  const essays = posts.filter(p => p.data.contentType === 'essay');
  const briefs = posts.filter(p => p.data.contentType === 'brief');
  const elsewhere = posts.filter(p => p.data.contentType === 'elsewhere');

  // Collect unique tags and categories
  const tags = new Set<string>();
  const categories = new Set<string>();

  posts.forEach(post => {
    if (post.data.tags) {
      post.data.tags.forEach((tag: string) => tags.add(tag));
    }
    if (post.data.category) {
      categories.add(post.data.category);
    }
    if (post.data.categories) {
      post.data.categories.forEach((cat: string) => categories.add(cat));
    }
  });

  // Build the llms.txt content
  const content = `# ${SITE?.name || 'CTO4.AI'}

> ${SITE?.description || 'AI and technology insights from a CTO perspective. Blog covering AI engineering, developer tools, and technology trends.'}

## Site Overview

CTO4.AI is a technology blog focused on AI engineering, developer tools, and insights from a CTO perspective. The blog features in-depth essays, brief thoughts, curated content from elsewhere, and analysis of the latest developments in AI and technology.

## Recent Posts

${recentPosts.map(post => {
  const slug = post.id.replace('/index.mdx', '').replace('index.mdx', '');
  const url = `https://cto4.ai/p/${slug}`;
  const title = post.data.title;
  const description = post.data.description || post.data.excerpt || '';
  const date = new Date(post.data.publishDate || post.data.date || Date.now()).toISOString().split('T')[0];
  return `- [${title}](${url}) (${date}): ${description}`;
}).join('\n')}

## Content Types

### Essays (${essays.length} posts)
Long-form articles with in-depth analysis and insights.
View all: https://cto4.ai/archive

### Briefs (${briefs.length} posts)
Short-form thoughts and quick observations.

### Elsewhere (${elsewhere.length} posts)
Curated content and commentary on external articles.

## Topics

### Popular Tags
${Array.from(tags).slice(0, 20).sort().map(tag =>
  `- [${tag}](https://cto4.ai/tag/${tag.toLowerCase().replace(/\s+/g, '-')})`
).join('\n')}

### Categories
${Array.from(categories).sort().map(category =>
  `- [${category}](https://cto4.ai/category/${category.toLowerCase().replace(/\s+/g, '-')})`
).join('\n')}

## Site Navigation

- [Home](https://cto4.ai/)
- [Archive (All Posts)](https://cto4.ai/archive)
- [Services](https://cto4.ai/services)
- [About](https://cto4.ai/about)
- [Subscribe](https://cto4.ai/subscribe)
- [Search](https://cto4.ai/search)
- [RSS Feed](https://cto4.ai/rss.xml)

## About the Author

Jack Ivers is a fractional CTO and technology consultant with expertise in AI engineering, software architecture, and technology strategy. This blog shares insights from working with startups and enterprises on their technology challenges.

## Services Offered

- Fractional CTO services
- AI strategy and implementation
- Technology architecture consulting
- Engineering team leadership
- Product development guidance

Learn more: https://cto4.ai/services

## Contact & Social

- Website: https://cto4.ai
- Subscribe: https://cto4.ai/subscribe

---

*This file is generated automatically to help AI systems understand the content and structure of cto4.ai. For complete content, see https://cto4.ai/llms-full.txt*
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};