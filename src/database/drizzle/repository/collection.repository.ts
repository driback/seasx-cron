import { eq, inArray } from "drizzle-orm";
import { db } from "../client";
import { collection, collectionItem } from "../schema";
import { handleMutateResponse } from "./_helper";

type CollectionValues = typeof collection.$inferInsert;
type CollectionItemValues = typeof collectionItem.$inferInsert;

export const insertCollection = async (data: CollectionValues[]) => {
  const res = await db.insert(collection).values(data).returning();
  return handleMutateResponse(res);
};

export const updateCollectionById = async (id: string, data: CollectionValues) => {
  const res = await db.update(collection).set(data).where(eq(collection.id, id)).returning();
  return handleMutateResponse(res);
};

export const deleteCollectionById = async (id: string) => {
  const res = await db.delete(collection).where(eq(collection.id, id)).returning();
  return handleMutateResponse(res);
};

export const insertCollectionItem = async (data: CollectionItemValues[]) => {
  const res = await db.insert(collectionItem).values(data).returning();
  return handleMutateResponse(res);
};

export const deleteCollectionItemByIds = async (ids: string[]) => {
  const res = await db.delete(collectionItem).where(inArray(collectionItem.id, ids)).returning();
  return handleMutateResponse(res);
};
