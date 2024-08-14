import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v4 } from "uuid";
import { channel } from "./channel";
import { platform } from "./platform";
import { type Thumbnail, video } from "./video";

export const photo = pgTable(
  "photo",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => v4())
      .notNull(),
    createAt: timestamp("create_at", { precision: 3, mode: "date" }).defaultNow().notNull(),
    channelId: text("channel_id").references(() => channel.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    videoId: text("video_id").references(() => video.id, { onUpdate: "cascade" }),
    platformId: text("platform_id").references(() => platform.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    sizes: jsonb("sizes").$type<Thumbnail>().notNull(),
  },
  (table) => {
    return {
      photoIdIdx: index("photo_id_idx").on(table.id),
      sortingAndFilteringIdx: index("photo_sorting_and_filtering_index").using(
        "btree",
        table.createAt,
        table.videoId,
        table.channelId,
      ),
    };
  },
);
