import { relations } from "drizzle-orm/relations";
import {
  channel,
  channelBanner,
  collection,
  collectionItem,
  photo,
  platform,
  socialLinks,
  video,
  videoPlaybackSource,
  videoTimeStamp,
  videoTimeStamps,
  videoWatched,
} from ".";

export const platformRelations = relations(platform, ({ many }) => ({
  channels: many(channel),
  photos: many(photo),
  videos: many(video),
}));

export const collectionItemRelation = relations(collectionItem, ({ one }) => ({
  channel: one(channel, {
    fields: [collectionItem.channelId],
    references: [channel.id],
  }),
  collection: one(collection, {
    fields: [collectionItem.collectionId],
    references: [collection.id],
  }),
  photo: one(photo, {
    fields: [collectionItem.photoId],
    references: [photo.id],
  }),
  video: one(video, {
    fields: [collectionItem.videoId],
    references: [video.id],
  }),
}));

export const collectionRelation = relations(collection, ({ many }) => ({
  items: many(collectionItem),
}));

export const channelRelations = relations(channel, ({ one, many }) => ({
  platform: one(platform, {
    fields: [channel.platformId],
    references: [platform.id],
  }),
  channelBanners: many(channelBanner),
  photos: many(photo),
  socialLinks: many(socialLinks),
  videos: many(video),
  collectionItem: many(collectionItem),
}));

export const channelBannerRelations = relations(channelBanner, ({ one }) => ({
  channel: one(channel, {
    fields: [channelBanner.channelId],
    references: [channel.id],
  }),
}));

export const photoRelations = relations(photo, ({ one, many }) => ({
  channel: one(channel, {
    fields: [photo.channelId],
    references: [channel.id],
  }),
  platform: one(platform, {
    fields: [photo.platformId],
    references: [platform.id],
  }),
  video: one(video, {
    fields: [photo.videoId],
    references: [video.id],
  }),
  collectionItem: many(collectionItem),
}));

export const videoRelations = relations(video, ({ one, many }) => ({
  photos: many(photo),
  channel: one(channel, {
    fields: [video.channelId],
    references: [channel.id],
  }),
  platform: one(platform, {
    fields: [video.platformId],
    references: [platform.id],
  }),
  videoPlaybackSources: one(videoPlaybackSource),
  videoTimeStamps: many(videoTimeStamps),
  videoWatch: one(videoWatched, {
    fields: [video.id],
    references: [videoWatched.id],
  }),
  collectionItem: many(collectionItem),
}));

export const socialLinksRelations = relations(socialLinks, ({ one }) => ({
  channel: one(channel, {
    fields: [socialLinks.channelId],
    references: [channel.id],
  }),
}));

export const videoPlaybackSourceRelations = relations(videoPlaybackSource, ({ one }) => ({
  video: one(video, {
    fields: [videoPlaybackSource.videoId],
    references: [video.id],
  }),
}));

export const videoTimeStampRelations = relations(videoTimeStamp, ({ one }) => ({
  videoTimeStamp: one(videoTimeStamps, {
    fields: [videoTimeStamp.videoTimeStampsId],
    references: [videoTimeStamps.id],
  }),
}));

export const videoTimeStampsRelations = relations(videoTimeStamps, ({ one, many }) => ({
  videoTimeStamps: many(videoTimeStamp),
  video: one(video, {
    fields: [videoTimeStamps.videoId],
    references: [video.id],
  }),
}));

export const videoWatchedRelation = relations(videoWatched, ({ one }) => ({
  video: one(video, {
    fields: [videoWatched.videoId],
    references: [video.id],
  }),
}));
