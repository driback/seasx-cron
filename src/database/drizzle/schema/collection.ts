import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { channel } from "./channel";
import { photo } from "./photo";
import { video } from "./video";

export const collectionItem = pgTable(
  "collection_item",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid(10))
      .notNull(),
    collectionId: text("folder-id")
      .notNull()
      .references(() => collection.id, { onDelete: "cascade", onUpdate: "cascade" }),
    channelId: text("channel-id").references(() => channel.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    photoId: text("photo-id").references(() => photo.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    videoId: text("video-id").references(() => video.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (table) => {
    return {
      collectionItemIdIndex: index("collection_id_index").on(table.id),
      collectionIdIndex: index("collection_item_id_index").on(table.collectionId),
      collectionItemVideoIdIndex: index("collection_item_video_id_index").on(table.videoId),
      collectionItemChannelIdIndex: index("collection_item_channel_id_index").on(table.channelId),
      collectionItemPhotoIdIndex: index("collection_item_photo_id_index").on(table.photoId),
    };
  },
);

export const collectionTypeEnum = pgEnum("collection-enum", ["video", "channel", "photo"]);
export const collection = pgTable("collection", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10))
    .notNull(),
  name: text("name").notNull(),
  color: text("color").default("#fff").notNull(),
  type: collectionTypeEnum("type").default("video").notNull(),
  updateAt: timestamp("update_at", { precision: 3, mode: "date" }).defaultNow().notNull(),
  createAt: timestamp("create_at", { precision: 3, mode: "date" }).defaultNow().notNull(),
});
