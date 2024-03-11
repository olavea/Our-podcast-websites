import { defineCollection, z } from "astro:content";

const episodeCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    totalDownloads: z.number(),
    description: z.string(),
    embed_html: z.string(),
  }),
});

export const collections = {
  episodes: episodeCollection,
};
