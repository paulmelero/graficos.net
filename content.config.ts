import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      // Load every file inside the `content/pages` directory
      source: 'pages/*.md',
      // Specify the type of content in this collection
      type: 'page',
    }),
    blog: defineCollection({
      // Load every file inside the `content/blog` directory
      source: 'blog/*.md',
      // Specify the type of content in this collection
      type: 'page',
      schema: z.object({
        title: z.string(),
        summary: z.string(),
        description: z.string().default(''),
        tags: z.array(z.string()).default([]),
        lang: z.string().default('en'),
        date: z.string().default(new Date().toISOString()),
        thumbnail: z.string().default(''),
      }),
    }),
    slashes: defineCollection({
      // Load every file inside the `content/slashes` directory
      source: 'slashes/*.md',
      // Specify the type of content in this collection
      type: 'page',
    }),
    openSource: defineCollection({
      // Load every file inside the `content/openSource` directory
      source: 'openSource/*.md',
      // Specify the type of content in this collection
      type: 'page',
      schema: z.object({
        title: z.string(),
        summary: z.string(),
        description: z.string().default(''),
        tags: z.array(z.string()).default([]),
        yearCreated: z.number().default(new Date().getFullYear()),
        thumbnail: z.string().default(''),
        url: z.string().default(''),
        repositoryUrl: z.string().default(''),
        license: z.string().default('').optional(),
      }),
    }),
  },
})
