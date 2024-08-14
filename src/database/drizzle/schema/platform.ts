import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { v4 } from "uuid";

export const platform = pgTable("platform", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => v4())
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  website: varchar("website", { length: 256 }).notNull(),
  cookies: text("cookies"),
  totalChannels: integer("total_channels").default(0),
  totalVideos: integer("total_videos").default(0),
  createAt: timestamp("create_at", { precision: 3, mode: "date" }).defaultNow().notNull(),
  updateAt: timestamp("update_at", { precision: 3, mode: "date" }).defaultNow().notNull(),
});
