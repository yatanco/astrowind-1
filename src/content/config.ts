// src/content/config.ts

import { defineCollection, z, image } from "astro:content";

/**
 * 🔹 Shared metadata schema
 * Used inside posts for SEO and social previews.
 * You can reuse this in other collections if needed.
 */
const metadataDefinition = z
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
              // 👇 Keep as string for external URLs (e.g. og:image from CDN)
              // If you only want to allow local imports, replace `z.string()` with `image()`
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

/**
 * 🔹 Blog posts collection
 * Location: /src/content/post/*
 *
 * ✅ Enforces:
 * - Imported images (no broken relative paths)
 * - Proper dates (ISO strings in frontmatter)
 * - Draft support (defaults to false)
 */
const postCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),

    publishDate: z.date(), // must be `"2023-08-12"` style in frontmatter
    updateDate: z.date().optional(),
    draft: z.boolean().default(false),

    image: z
      .object({
        src: image(), // 👈 ensures only imported files are allowed
        alt: z.string(),
      })
      .optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition,
  }),
});

/**
 * 🔹 Export all collections here
 */
export const collections = {
  post: postCollection,
};
