import { waitUntil } from "@vercel/functions";
import { sql } from "drizzle-orm";
import { stringify } from "superjson";
import type { AfreecaTVVod } from "~/afreecatv/types/vod";
import {
  findChannelByChannelId,
  updateChannelById,
} from "~/database/drizzle/repository/channel.repository";
import {
  findPlatformByName,
  updatePlatformById,
} from "~/database/drizzle/repository/platform.repository";
import {
  insertVideo,
  insertVideoPlaybackSource,
  updateVideoById,
} from "~/database/drizzle/repository/video.repository";
import { buildAfreecaTvPlaybackResource, buildTempThumbnail } from "~/libs/utils";
import { createThumbnailBg } from "./create-tumbnail.helper";

export const createAfreecaTvVideo = async (data: Extract<AfreecaTVVod, { result: 1 }>["data"]) => {
  console.log("🚀 ~ createAfreecaTvVideo ~ videoId:", data.title_no);
  try {
    console.log("vodInfo: get vod from afreecatv");
    const platform = await findPlatformByName("afreecatv");
    if (!platform) return { success: false, data: null };

    const channel = await findChannelByChannelId(data.bj_id);
    if (!channel) return { success: false, data: { channelId: data.bj_id } };

    const vodDate = data.write_tm.split("~").at(-1) ?? "";
    const oriDate = new Date(vodDate);

    console.log("add: add vod to db");
    const newVod = await insertVideo([
      {
        videoId: `${data.title_no}`,
        title: data.title,
        duration: Math.round(data.total_file_duration * 0.001),
        originalPublishDate: oriDate,
        platformApiResponses: stringify(data),
        thumbnail: buildTempThumbnail(),
        channelId: channel.id,
        platformId: platform.id,
      },
    ]);

    if (!newVod) {
      console.error("add: Failed to insert new video");
      throw new Error("Failed to insert new video");
    }

    console.log("add: find playback resources");
    const { all, high, medium, low } = buildAfreecaTvPlaybackResource(data.files);

    console.log("add: create playback resources");
    await insertVideoPlaybackSource([
      {
        sources: { high, medium, low, all },
        videoId: newVod.id,
      },
    ]);

    const [_v, _c, _p] = await Promise.all([
      updateVideoById(newVod.id, { totalPart: all.length }),
      updateChannelById(channel.id, { totalVideos: sql`${channel.totalVideos} + 1` }),
      updatePlatformById(platform.id, { totalVideos: sql`${platform.totalVideos} + 1` }),
    ]);

    waitUntil(
      createThumbnailBg({
        platform: "afreecatv",
        thumbnailUrl: data.thumb,
        videoId: `${data.title_no}`,
        channelId: data.bj_id,
      }),
    );

    console.log("Done");

    return { success: true, data: { videoId: newVod.videoId } };
  } catch (error) {
    console.log("🚀 ~ .mutation ~ data:", error);
    return { success: false, data: null };
  }
};
