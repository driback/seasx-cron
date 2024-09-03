import { eq } from "drizzle-orm";
import { db } from "../client";
import { photo } from "../schema";
import { handleMutateResponse } from "./_helper";

type PhotoValues = typeof photo.$inferInsert;

export const insertPhoto = async (data: PhotoValues[]) => {
  const res = await db.insert(photo).values(data).returning();
  return handleMutateResponse(res);
};

export const updatePhotoById = async (id: string, data: Partial<PhotoValues>) => {
  const res = await db.update(photo).set(data).where(eq(photo.id, id)).returning();
  return handleMutateResponse(res);
};

export const deletePhotoById = async (id: string) => {
  const res = await db.delete(photo).where(eq(photo.id, id)).returning();
  return handleMutateResponse(res);
};
