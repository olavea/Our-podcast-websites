import { format, sub } from "date-fns";

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
const TODAY = new Date();
const START_DATE = sub(TODAY, { weeks: 53 });
const END_DATE = sub(TODAY, { weeks: 1 });

export async function fetchEpisodes(
  apiKey = TRANSISTOR_API_KEY,
  showId = TRANSISTOR_SHOW_ID,
  status = "published",
  pageSize = 50
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
      currentPage: response.meta.currentPage + 1,
      totalPages: response.meta.totalPages,
    };
  } while (meta.currentPage <= meta.totalPages);

  console.log("Fetched", episodeData.length, "episodes");

  return episodeData;
}

export async function fetchEpisode(episodeId, apiKey = TRANSISTOR_API_KEY) {
  const response = await fetch(
    `https://api.transistor.fm/v1/episodes/${episodeId}`,
    {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    }
  ).then((response) => response.json());
  return response.data;
}

export async function fetchEpisodeAnalytics(
  apiKey = TRANSISTOR_API_KEY,
  showId = TRANSISTOR_SHOW_ID,
  startDate = format(START_DATE, "dd-MM-yyyy"),
  endDate = format(END_DATE, "dd-MM-yyyy")
) {
  const response = await fetch(
    `https://api.transistor.fm/v1/analytics/${showId}/episodes?start_date=${startDate}&end_date=${endDate}`,
    {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    }
  ).then((response) => response.json());

  console.log(
    "FETCHING ANALYTICS",
    response.data.attributes.episodes.length,
    "episodes"
  );

  const analytics = response.data.attributes.episodes.map((episode: any) => {
    episode.totalDownloads = episode.downloads.reduce(
      (acc: number, day: any) => acc + day.downloads,
      0
    );
    return episode;
  });

  return analytics;
}

export async function fetchMostPopuplarEpisodes(count = 5) {
  const episodeAnalytics = await fetchEpisodeAnalytics();
  const sortedEpisodes = episodeAnalytics.sort(
    (a: any, b: any) => b.totalDownloads - a.totalDownloads
  );
  const mostPopular = sortedEpisodes.slice(0, count);
  return await Promise.all(
    mostPopular.map((episode: any) => fetchEpisode(episode.id))
  );
}
