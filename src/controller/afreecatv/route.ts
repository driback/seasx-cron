import type { Context } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";
import { afreecaTvApiServices } from "~/afreecatv/afreecatv-api-service";
import { db } from "~/database/drizzle/client";
import { findPlatformByName } from "~/database/drizzle/repository/platform.repository";
import { hmsToSeconds } from "~/libs/utils";
import { addAfreecaTvVideo } from "./helper/add-video.helper";
import { getAfreecaTvVideo } from "./helper/get-afreecatv-video";

const VIDEO_MIN_DURATION_SECONDS = 900;

const isVideoExist = async (videoId: string) => {
  const video = await db.query.video.findFirst({
    where: (vid, { eq }) => eq(vid.videoId, videoId),
    columns: { id: true },
  });
  return video ? null : videoId;
};

const getPlatformCookies = async () => {
  const platform = await findPlatformByName("afreecatv");
  return platform?.cookies || null;
};

export const afreecaTvController = async <T extends string>(
  c: Context<BlankEnv, T, BlankInput>,
) => {
  console.log("Fetching platform cookies...");
  const platformCookies = await getPlatformCookies();
  if (!platformCookies) {
    console.error("Cookies not found");
    return c.json({ error: "Cookies not found" });
  }

  console.log("Fetching AfreecaTV replays...");
  const replay = await afreecaTvApiServices.replay(platformCookies);
  if (!replay?.data) {
    console.error("No replays found");
    return c.json({ error: "Videos not found" });
  }

  console.log("Filtering replays based on duration...");
  const validReplays = replay.data.filter(
    (d) => hmsToSeconds(d.duration) >= VIDEO_MIN_DURATION_SECONDS,
  );

  if (validReplays.length === 0) {
    console.log("No valid replays found.");
    return c.json({ error: "No valid replays found" });
  }

  console.log("Checking for existing videos...");
  const videoCheckPromises = validReplays.map((video) => isVideoExist(`${video.title_no}`));
  const nonExistingVideos = (await Promise.all(videoCheckPromises)).filter(Boolean) as string[];

  if (nonExistingVideos.length === 0) {
    console.log("All videos already exist.");
    return c.json({ error: "All videos already exist" });
  }

  console.log("Fetching video details from AfreecaTV...");
  const videoDataPromises = nonExistingVideos.map((videoId) =>
    getAfreecaTvVideo(videoId, platformCookies),
  );
  const videoData = (await Promise.all(videoDataPromises)).filter((video) => video !== null);

  if (videoData.length === 0) {
    console.log("No new valid videos found.");
    return c.json({ error: "No new valid videos found" });
  }

  console.log("Adding videos to the database...");
  const addVideoPromises = videoData.map(addAfreecaTvVideo);
  const results = await Promise.all(addVideoPromises);

  console.log("Process complete.");

  return c.json({ data: results });
};
