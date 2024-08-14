import { waitUntil } from "@vercel/functions";
import { eq, sql } from "drizzle-orm";
import { stringify } from "superjson";
import { afreecaTvApiServices } from "~/afreecatv/afreecatv-api-service";
import type { File, Vod } from "~/afreecatv/types/vod";
import { uploadImage } from "~/libs/image-kit";
import {
  buildAfreecaTvPlaybackResource,
  buildTempThumbnail,
  buildThumbnailSources,
} from "~/libs/utils";
import { db } from "../../client";
import { channel, platform, video, videoPlaybackSource } from "../../schema";
import { createErrorResponse, createSuccessResponse } from "../utils";

export const fetchPlatformData = async (platformName: string) => {
  return await db.query.platform.findFirst({
    where: (platform, { eq }) => eq(platform.name, platformName),
    columns: { id: true, cookies: true },
  });
};

export const fetchVodData = async (videoId: number, cookies: string) => {
  const vod = await afreecaTvApiServices.vod(String(videoId), cookies);

  if (!vod || vod.result !== 1 || vod.data.flag !== "SUCCEED" || !vod.data.files.length) {
    return null;
  }

  return vod.data;
};

export const fetchChannelData = async (channelId: string) => {
  return await db.query.channel.findFirst({
    where: (channel, { eq }) => eq(channel.channelId, channelId),
    columns: { id: true },
  });
};

export const addVodToDatabase = async (vodData: Vod, platformId: string, channelId: string) => {
  const oriDate = new Date(vodData.write_tm.split("~").at(-1) ?? "");

  const newVod = await insertNewVideo(vodData, oriDate, platformId, channelId);
  if (!newVod) return createErrorResponse("Failed to insert new video");

  await createPlaybackResources(newVod.id, vodData.files);
  await updateVideoAndChannelCounts(channelId, platformId);

  const videoData = await fetchVideoData(newVod.videoId);
  return videoData
    ? createSuccessResponse(videoData)
    : createErrorResponse("Failed to fetch video data");
};

export const insertNewVideo = async (
  vodData: Vod,
  oriDate: Date,
  platformId: string,
  channelId: string,
) => {
  const [newVod] = await db
    .insert(video)
    .values({
      videoId: vodData.title_no,
      title: vodData.title,
      duration: Math.round(vodData.total_file_duration * 0.001),
      originalPublishDate: oriDate,
      platformApiResponses: stringify(vodData),
      thumbnail: buildTempThumbnail(),
      channelId,
      platformId,
    })
    .returning({ id: video.id, videoId: video.videoId });

  return newVod;
};

export const createPlaybackResources = async (videoId: string, files: File[]) => {
  const { all, high, medium, low } = buildAfreecaTvPlaybackResource(files);
  await db
    .insert(videoPlaybackSource)
    .values({ sources: { high, medium, low, all }, videoId: videoId });

  await db.update(video).set({ totalPart: all.length }).where(eq(video.id, videoId));
};

export const updateVideoAndChannelCounts = async (channelId: string, platformId: string) => {
  await db
    .update(channel)
    .set({ totalVideos: sql`${channel.totalVideos} + 1` })
    .where(eq(channel.id, channelId));
  await db
    .update(platform)
    .set({ totalVideos: sql`${platform.totalVideos} + 1` })
    .where(eq(platform.id, platformId));
};

export const fetchVideoData = async (videoId: number) => {
  return await db.query.video.findFirst({
    where: (vid, { eq }) => eq(vid.videoId, videoId),
    columns: { videoId: true },
    with: { channel: { columns: { channelId: true } } },
  });
};

export const scheduleThumbnailCreation = (
  thumbnailUrl: string,
  videoId: number,
  channelId: string,
) => {
  waitUntil(createThumbnailBg({ thumbnailUrl, videoId, channelId }));
};

type CreateThumbnailBgSchema = {
  channelId: string;
  videoId: number;
  thumbnailUrl: string;
};

export const createThumbnailBg = async (props: CreateThumbnailBgSchema) => {
  console.log("Create tumbnail", props.videoId);
  const uploadVodThumbnail = await uploadImage({
    file: props.thumbnailUrl,
    fileName: `${props.videoId}.jpg`,
    folder: `afreecatv/${props.channelId}/vod/`,
  });

  const thumb = buildThumbnailSources(uploadVodThumbnail.url, "vod");
  console.log("Insert tumbnail", props.videoId);
  const [createThumb] = await db
    .update(video)
    .set({ thumbnail: thumb })
    .where(eq(video.videoId, props.videoId))
    .returning({ thumbnail: video.thumbnail });

  console.log("Done create tumbnail", props.videoId);
  return createThumb;
};
