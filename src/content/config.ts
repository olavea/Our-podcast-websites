import { defineCollection, z } from "astro:content";

const episodeCollection = defineCollection({
  type: "data",
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    number: z.number(),
    duration: z.number(),
    totalDownloads: z.number(),
    formatted_summary: z.string(),
    description: z.string(),
    embed_html: z.string(),
  }),
});

export const collections = {
  episodes: episodeCollection,
};
