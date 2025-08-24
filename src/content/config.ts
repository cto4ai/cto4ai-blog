import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postsCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/posts' }),
  schema: z.object({
    publishDate: z.coerce.date().optional(),
    updateDate: z.coerce.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    featured: z.boolean().optional(),

    metadata: metadataDefinition(),
  }),
});

const microCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/micro' }),
  schema: z.object({
    publishDate: z.coerce.date().optional(),
    updateDate: z.coerce.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    author: z.string().optional(),
    featured: z.boolean().optional(),

    metadata: metadataDefinition(),
  }),
});

const elsewhereCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/elsewhere' }),
  schema: z.object({
    publishDate: z.coerce.date().optional(),
    updateDate: z.coerce.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    sourceLink: z.string().url().optional(),
    author: z.string().optional(),
    featured: z.boolean().optional(),

    metadata: metadataDefinition(),
  }),
});

const quoteCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/quote' }),
  schema: z.object({
    publishDate: z.coerce.date().optional(),
    updateDate: z.coerce.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    sourceLink: z.string().url().optional(),
    author: z.string().optional(),
    featured: z.boolean().optional(),
    categories: z.array(z.string()).optional(),
    ShowToc: z.boolean().optional(),
    ShowBreadCrumbs: z.boolean().optional(),
    hideMeta: z.boolean().optional(),

    metadata: metadataDefinition(),
  }),
});

// New unified content collection for migrated content
const contentCollection = defineCollection({
  loader: glob({ pattern: ['*/index.md', '*/index.mdx'], base: 'src/data/content' }),
  schema: z.object({
    publishDate: z.coerce.date().optional(),
    updateDate: z.coerce.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    
    // Content type from Phase 1
    contentType: z.enum(['essay', 'brief', 'elsewhere', 'quote', 'episodes']).optional(),
    
    // Common fields across all types
    category: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    featured: z.boolean().optional(),
    sourceLink: z.string().url().optional(),
    
    // Legacy fields
    ShowToc: z.boolean().optional(),
    ShowBreadCrumbs: z.boolean().optional(),
    hideMeta: z.boolean().optional(),

    metadata: metadataDefinition(),
  }),
});

export const collections = {
  posts: postsCollection,
  micro: microCollection,
  elsewhere: elsewhereCollection,
  quote: quoteCollection,
  content: contentCollection, // New unified collection
};
