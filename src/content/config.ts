import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.enum(['pwn', 'web', 'crypto', 'reverse', 'forensics', 'misc', 'osint', 'hardware']).default('misc'),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    visible: z.boolean().default(true),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.enum(['tool', 'research', 'script', 'webapp', 'other']).default('other'),
    github: z.string().optional(),
    demo: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.enum(['active', 'completed', 'archived']).default('active'),
  }),
});

export const collections = {
  'blog': blog,
  'projects': projects,
};
