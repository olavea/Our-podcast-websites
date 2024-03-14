import "dotenv/config";
import { join } from "node:path";
import { writeFile } from "node:fs";
import { format, sub } from "date-fns";

const TRANSISTOR_API_KEY = process.env.TRANSISTOR_API_KEY;
const TRANSISTOR_SHOW_ID = process.env.TRANSISTOR_SHOW_ID;
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

  const episodeData = [];

  do {
    const response = await fetch(
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

  return episodeData;
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

  return response.data;
}

const episodeData = await fetchEpisodes();
const episodeAnalytics = await fetchEpisodeAnalytics();

const episodeFilePromises = episodeData.map((episode) => {
  const analytics = episodeAnalytics.attributes.episodes.find((a) => {
    return parseInt(a.id) === parseInt(episode.id);
  });

  const totalDownloads = analytics.downloads.reduce(
    (acc, day) => acc + day.downloads,
    0
  );

  return writeFile(
    join(process.cwd() + `/src/content/episodes/${episode.id}.json`),
    JSON.stringify(
      {
        ...episode.attributes,
        totalDownloads,
      },
      null,
      2
    ),
    (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    }
  );
});

await Promise.all(episodeFilePromises);
