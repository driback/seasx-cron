import { and, eq } from "drizzle-orm";
import type { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db } from "../client";
import { video, videoPlaybackSource, videoTimeStamp, videoTimeStamps } from "../schema";
import { handleMutateResponse } from "./_helper";

type VideoValues = typeof video.$inferInsert;
type VideoUpdateValues = PgUpdateSetSource<typeof video>;
type VideoPlaybacklValues = typeof videoPlaybackSource.$inferInsert;
type VideoTimeStampValues = typeof videoTimeStamp.$inferInsert;
type VideoTimeStampUpdateValues = PgUpdateSetSource<typeof videoTimeStamp>;
type VideoTimeStampsValues = typeof videoTimeStamps.$inferInsert;

export const insertVideo = async (data: VideoValues[]) => {
  const res = await db.insert(video).values(data).returning();
  return handleMutateResponse(res);
};

export const updateVideoById = async (id: string, data: VideoUpdateValues) => {
  const res = await db.update(video).set(data).where(eq(video.id, id)).returning();
  return handleMutateResponse(res);
};

export const deleteVideoById = async (id: string) => {
  const res = await db.delete(video).where(eq(video.id, id)).returning();
  return handleMutateResponse(res);
};

export const updateVideoByVideoId = async (videoId: string, data: VideoUpdateValues) => {
  const res = await db.update(video).set(data).where(eq(video.videoId, videoId)).returning();
  return handleMutateResponse(res);
};

export const insertVideoPlaybackSource = async (data: VideoPlaybacklValues[]) => {
  const res = await db.insert(videoPlaybackSource).values(data).returning();
  return handleMutateResponse(res);
};

export const insertVideoTimestamp = async (data: VideoTimeStampValues[]) => {
  const res = await db.insert(videoTimeStamp).values(data).returning();
  return handleMutateResponse(res);
};

export const updateVideoTimestampById = async (id: string, data: VideoTimeStampUpdateValues) => {
  const res = await db
    .update(videoTimeStamp)
    .set(data)
    .where(eq(videoTimeStamp.id, id))
    .returning();
  return handleMutateResponse(res);
};

export const insertVideoTimestamps = async (data: VideoTimeStampsValues[]) => {
  const res = await db.insert(videoTimeStamps).values(data).returning();
  return handleMutateResponse(res);
};

export const deleteVideoTimestampsByIdAndPart = async (id: string, part: number) => {
  const res = await db
    .delete(videoTimeStamps)
    .where(and(eq(videoTimeStamps.id, id), eq(videoTimeStamps.part, part)))
    .returning();
  return handleMutateResponse(res);
};
