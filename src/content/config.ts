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

// Unified content collection - all content types in one collection
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
  content: contentCollection, // Unified collection for all content types
};
