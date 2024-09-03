import { boolean, index, integer, jsonb, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { v4 } from "uuid";
import { platform } from "./platform";
import type { Thumbnail } from "./video";

export const channel = pgTable(
  "channel",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => v4())
      .notNull(),
    channelId: varchar("channel_id", { length: 256 }).notNull(),
    channelName: varchar("channel_name", { length: 256 }).notNull(),
    isFavorite: boolean("is_favorite").default(false).notNull(),
    platformApiResponses: text("platform_api_responses").default("").notNull(),
    platformLink: varchar("platform_link", { length: 256 }).notNull(),
    totalVideos: integer("total_videos").default(0),
    logo: jsonb("logo").$type<Thumbnail>().notNull(),
    createAt: timestamp("create_at", { precision: 3, mode: "date" }).defaultNow().notNull(),
    platformId: text("platform_id").references(() => platform.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  },
  (table) => {
    return {
      channelidIdx: index("channel_channelid_idx").on(table.channelId),
      createAtIdx: index("channel_create_at_idx").on(table.createAt),
      favoriteIdx: index("channel_favorite_idx").on(table.isFavorite),
      sortingAndFilteringIdx: index("channel_sorting_and_filtering_index").using(
        "btree",
        table.createAt,
        table.channelId,
        table.isFavorite,
      ),
    };
  },
);

export const channelBanner = pgTable(
  "channel_banner",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => v4())
      .notNull(),
    source: text("source").notNull(),
    position: integer("position").array(),
    createAt: timestamp("create_at", { precision: 3, mode: "date" }).defaultNow().notNull(),
    channelId: text("channel_id")
      .notNull()
      .references(() => channel.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      idIdx: index("channel_banner_id_idx").using("btree", table.id),
    };
  },
);

export const socialLinks = pgTable("social_links", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10))
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  link: varchar("link", { length: 256 }).notNull(),
  platform: varchar("platform", { length: 256 }).notNull(),
  createAt: timestamp("create_at", { precision: 3, mode: "date" }).defaultNow().notNull(),
  channelId: text("channel_id").references(() => channel.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
