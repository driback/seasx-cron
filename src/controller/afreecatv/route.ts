import type { Context } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";
import { afreecaTvApiServices } from "~/afreecatv/afreecatv-api-service";
import { db } from "~/database/drizzle/client";
import { findPlatformByName } from "~/database/drizzle/repository/platform.repository";
import { hmsToSeconds } from "~/libs/utils";
import { addAfreecaTvVideo } from "./helper/add-video.helper";

const isVideoExist = async (videoId: string) => {
  const isVid = await db.query.video.findFirst({
    where: (vid, { eq }) => eq(vid.videoId, videoId),
    columns: { id: true },
  });

  if (isVid) return null;

  return videoId;
};

export const afreecaTvController = async <T extends string>(
  c: Context<BlankEnv, T, BlankInput>,
) => {
  try {
    console.log("Find cookies");
    const platform = await findPlatformByName("afreecatv");

    if (!platform?.cookies) {
      console.log("Done.");
      return c.json({ error: "Cookies not found" });
    }

    console.log("Get replays");
    const replay = await afreecaTvApiServices.replay(platform.cookies);

    if (!replay) {
      console.log("Done.");
      return c.json({ data: null, error: "Videos not found" });
    }

    console.log("Filtering replays");
    const filteredData = replay.data.filter((d) => hmsToSeconds(d.duration) >= 900);

    console.log("isVideoExists");
    const isVideoExists = await Promise.all(
      filteredData.map((video) => isVideoExist(`${video.title_no}`)),
    );

    console.log("Filtering isVideoExists");
    const filtered = isVideoExists.filter(Boolean) as string[];

    if (!filtered.length) {
      console.log("Done.");
      return c.json({ data: null, error: "all good" });
    }

    console.log("Working promises");
    const results = await Promise.allSettled(filtered.map(addAfreecaTvVideo));

    console.log("Done.");
    return c.json({ data: results.filter((s) => s.status === "fulfilled") });
  } catch (error) {
    console.log("🚀 ~ app.get ~ error:", error);
    return c.json({ data: "Something went wrong" });
  }
};
