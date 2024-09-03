import { eq } from "drizzle-orm";
import type { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db } from "../client";
import { platform } from "../schema";
import { handleMutateResponse, handleQueryResponse } from "./_helper";

type PlatformValues = typeof platform.$inferInsert;
type PlatformUpdateValues = PgUpdateSetSource<typeof platform>;

export const insertPlatform = async (data: PlatformValues[]) => {
  const res = await db.insert(platform).values(data).returning();
  return handleMutateResponse(res);
};

export const updatePlatformById = async (id: string, data: PlatformUpdateValues) => {
  const res = await db.update(platform).set(data).where(eq(platform.id, id)).returning();
  return handleMutateResponse(res);
};

export const findPlatformByName = async (name: string) => {
  const res = await db.query.platform.findFirst({ where: (pl, { eq }) => eq(pl.name, name) });
  return handleQueryResponse(res);
};
