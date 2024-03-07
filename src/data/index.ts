interface Episode {
  slug: string;
  title: string;
  description: string;
  embed_html: string;
}

interface EpisodeData {
  id: string;
  type: string;
  attributes: Episode;
}

interface TransistorEpisodeResponse {
  data: EpisodeData[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

const TRANSISTOR_API_KEY = import.meta.env.TRANSISTOR_API_KEY;
const TRANSISTOR_SHOW_ID = import.meta.env.TRANSISTOR_SHOW_ID;
const IS_DEV = import.meta.env.DEV;

export async function fetchEpisodes(
  apiKey = TRANSISTOR_API_KEY,
  showId = TRANSISTOR_SHOW_ID,
  status = "published",
  pageSize = 50,
  fetchAll = !IS_DEV
) {
  let meta = {
    currentPage: 1,
    totalPages: -1,
  };

  const episodeData: EpisodeData[] = [];

  do {
    const response: TransistorEpisodeResponse = await fetch(
      `https://api.transistor.fm/v1/episodes?show_id=${showId}&status=${status}&pagination[per]=${pageSize}&pagination[page]=${meta.currentPage}`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
        },
      }
    ).then((response) => response.json());

    episodeData.push(...response.data);

    meta = {
      currentPage: response.meta.currentPage,
      totalPages: response.meta.totalPages,
    };
  } while (fetchAll && meta.currentPage <= meta.totalPages);

  console.log("Fetched", episodeData.length, "episodes");

  return episodeData;
}
