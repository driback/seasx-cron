import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { v4 } from "uuid";
import { channel } from "./channel";
import { platform } from "./platform";

export type Thumbnail = {
  big: string;
  large: string;
  small: string;
  medium: string;
  original: string;
};

type Playback = {
  high: string[];
  medium: string[];
  low: string[];
  all: string[];
};

export const video = pgTable(
  "video",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => v4())
      .notNull(),
    videoId: integer("video_id").notNull(),
    title: text("title").notNull(),
    duration: integer("duration").notNull(),
    originalPublishDate: timestamp("original_publish_date", {
      precision: 3,
      mode: "date",
    }).notNull(),
    isFavorite: boolean("isFavorite").default(false).notNull(),
    platformApiResponses: text("platform_api_responses"),
    createAt: timestamp("createAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
    totalPart: integer("total_part").default(0).notNull(),
    thumbnail: jsonb("thumbnail").$type<Thumbnail>().notNull(),
    platformId: text("platform_id").references(() => platform.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    channelId: text("channel_id").references(() => channel.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  },
  (table) => {
    return {
      channelIdIdx: index("video_channelId_idx").on(table.channelId),
      durationIdx: index("video_duration_idx").on(table.duration),
      favoriteIdx: index("video_favorite_idx").on(table.isFavorite),
      publishDateIdx: index("video_publish_date_idx").on(table.originalPublishDate),
      titleIdx: index("video_title_idx").on(table.title),
      totalPartIdx: index("video_total_part_idx").on(table.totalPart),
      videoidIdx: index("video_videoid_idx").on(table.videoId),
      sortingAndFilteringIdx: index("video_sorting_and_filtering_index").using(
        "btree",
        table.originalPublishDate,
        table.totalPart,
        table.duration,
        table.title,
        table.isFavorite,
        table.channelId,
      ),
    };
  },
);

export const videoPlaybackSource = pgTable(
  "video_playback_source",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => v4())
      .notNull(),
    sources: jsonb("sources").$type<Playback>().notNull(),
    createAt: timestamp("create_at", { precision: 3, mode: "date" }).defaultNow().notNull(),
    videoId: text("video_id")
      .notNull()
      .references(() => video.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      playbackId: index("playback_id_idx").on(table.id),
      playbackVideoId: index("playback_video_id_idx").on(table.videoId),
    };
  },
);

export const videoTimeStamp = pgTable(
  "video_time_stamp",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => v4())
      .notNull(),
    time: decimal("time").notNull(),
    thumbnail: text("thumbnail").notNull(),
    videoTimeStampsId: text("video_time_stamps_id").references(() => videoTimeStamps.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (table) => {
    return {
      timeStampId: index("timestamp_id_idx").on(table.id),
    };
  },
);

export const videoTimeStamps = pgTable(
  "video_time_stamps",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => v4())
      .notNull(),
    part: integer("part").notNull(),
    createAt: timestamp("create_at", { precision: 3, mode: "date" }).defaultNow().notNull(),
    videoId: text("video_id")
      .notNull()
      .references(() => video.id, { onDelete: "restrict", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      timeStampsId: index("timestamps_id_idx").on(table.id),
      timeStampsVideoId: index("timestamps_video_id_idx").on(table.videoId),
    };
  },
);
