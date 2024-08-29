import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { afreecaTvApiServices } from "./afreecatv/afreecatv-api-service";
import { db } from "./database/drizzle/client";
import { createChannel } from "./database/drizzle/services/channel/create-channel";
import { createVideo } from "./database/drizzle/services/video/create-video";
import { hmsToSeconds } from "./libs/utils";

const app = new Hono();

const isVideoExist = async (videoId: number) => {
  const isVid = await db.query.video.findFirst({
    where: (vid, { eq }) => eq(vid.videoId, videoId),
    columns: { id: true },
  });

  if (isVid) return null;

  return videoId;
};

const addVideo = async (videoId: number) => {
  try {
    const nvideo = await createVideo({ videoId });
    if (!nvideo.success) return null;

    let MAX_RETRIES = 3;

    if (typeof nvideo.data === "string") {
      while (MAX_RETRIES > 0) {
        const addCh = await createChannel({ channelId: nvideo.data });
        if (!addCh.success) {
          MAX_RETRIES -= 1;
          continue;
        }

        const add = await createVideo({ videoId });

        MAX_RETRIES -= 1;

        if (add.success) {
          break;
        }
      }
    }

    if (!MAX_RETRIES) return null;

    return videoId;
  } catch (error) {
    console.log("🚀 ~ addVideo ~ error:", error);
    return null;
  }
};

app.get("/", async (c) => {
  return c.json({ data: "Hello" });
});

app.get("/cron", async (c) => {
  try {
    console.log("Find cookies");
    const platform = await db.query.platform.findFirst({
      where: (pl, { eq }) => eq(pl.name, "afreecatv"),
    });

    if (!platform?.cookies) {
      console.log("Done.");
      return c.json({ error: "Cookies not found" });
    }

    console.log("Get replays");
    const replay = await afreecaTvApiServices.replay(platform.cookies);

    if (!replay.data.length) {
      console.log("Done.");
      return c.json({ data: null, error: "Videos not found" });
    }

    console.log("Filtering replays");
    const filteredData = replay.data.filter((d) => hmsToSeconds(d.duration) >= 900);

    console.log("isVideoExists");
    const isVideoExists = await Promise.all(
      filteredData.map((video) => isVideoExist(video.title_no)),
    );

    console.log("Filtering isVideoExists");
    const filtered = isVideoExists.filter(Boolean) as number[];

    if (!filtered.length) {
      console.log("Done.");
      return c.json({ data: null, error: "all good" });
    }

    console.log("Working promises");
    const results = await Promise.all(filtered.map(addVideo));

    console.log("Done.");
    return c.json({ data: results.filter(Boolean) });
  } catch (error) {
    console.log("🚀 ~ app.get ~ error:", error);
    return c.json({ data: "Something went wrong" });
  }
});

const port = Number(process.env.PORT) ?? 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
