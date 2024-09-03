import { eq } from "drizzle-orm";
import type { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db } from "../client";
import { channel, channelBanner, socialLinks } from "../schema/channel";
import { handleMutateResponse, handleQueryResponse } from "./_helper";

type ChannelValues = typeof channel.$inferInsert;
type ChannelUpdateValues = PgUpdateSetSource<typeof channel>;
type ChanneBannerValues = typeof channelBanner.$inferInsert;
type ChannelBannerUpdateValues = PgUpdateSetSource<typeof channelBanner>;
type SocialLinksValues = typeof socialLinks.$inferInsert;

export const findChannelByChannelId = async (channelId: string) => {
  const res = await db.query.channel.findFirst({
    where: (ch, { eq }) => eq(ch.channelId, channelId),
  });
  return handleQueryResponse(res);
};

export const insertChannel = async (data: ChannelValues[]) => {
  const res = await db.insert(channel).values(data).returning();
  return handleMutateResponse(res);
};

export const updateChannelById = async (id: string, data: ChannelUpdateValues) => {
  const res = await db.update(channel).set(data).where(eq(channel.id, id)).returning();
  return handleMutateResponse(res);
};

export const deleteChannelById = async (id: string) => {
  const res = await db.delete(channel).where(eq(channel.id, id)).returning();
  return handleMutateResponse(res);
};

export const insertChannelBanner = async (data: ChanneBannerValues[]) => {
  const res = await db.insert(channelBanner).values(data).returning();
  return handleMutateResponse(res);
};

export const updateChannelBannerById = async (id: string, data: ChannelBannerUpdateValues) => {
  const res = await db.update(channelBanner).set(data).where(eq(channelBanner.id, id)).returning();
  return handleMutateResponse(res);
};

export const insertSocialLinks = async (data: SocialLinksValues[]) => {
  const res = await db.insert(socialLinks).values(data).returning();
  return handleMutateResponse(res);
};
