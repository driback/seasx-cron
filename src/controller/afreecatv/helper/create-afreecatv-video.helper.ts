import { waitUntil } from "@vercel/functions";
import { sql } from "drizzle-orm";
import { stringify } from "superjson";
import { afreecaTvApiServices } from "~/afreecatv/afreecatv-api-service";
import { db } from "~/database/drizzle/client";
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

export const createAfreecaTvVideo = async (videoId: string) => {
  console.log("🚀 ~ createAfreecaTvVideo ~ videoId:", videoId);
  try {
    console.log("vodInfo: get vod from afreecatv");
    const platform = await findPlatformByName("afreecatv");
    if (!platform?.cookies) return { success: false, data: null };

    const vod = await afreecaTvApiServices.vod(videoId, platform.cookies);
    if (!vod || vod.result !== 1) {
      console.log("vodInfo: error", vod);
      return { success: false, data: null };
    }

    const { data } = vod;

    if (data.flag !== "SUCCEED") {
      console.log("🚀 ~ .mutation ~ data.flag:", data.flag);
      return { success: false, data: null };
    }

    if (!data.files.length) {
      return { success: false, data: null };
    }

    const channel = await findChannelByChannelId(data.bj_id);

    if (!channel) {
      return { success: false, data: { channelId: data.bj_id } };
    }

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

    await updateVideoById(newVod.id, { totalPart: all.length });

    await updateChannelById(channel.id, { totalVideos: sql`${channel.totalVideos} + 1` });

    await updatePlatformById(platform.id, {
      totalVideos: sql`${platform.totalVideos} + 1`,
    });

    const v = await db.query.video.findFirst({
      where: (vid, { eq }) => eq(vid.id, newVod.id),
      columns: { videoId: true },
      with: { channel: { columns: { channelId: true } } },
    });

    waitUntil(
      createThumbnailBg({
        platform: "afreecatv",
        thumbnailUrl: data.thumb,
        videoId: `${data.title_no}`,
        channelId: data.bj_id,
      }),
    );

    console.log("Done");

    return { success: true, data: { videoId: v?.videoId } };
  } catch (error) {
    console.log("🚀 ~ .mutation ~ data:", error);
    return { success: false, data: null };
  }
};
