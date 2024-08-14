import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const createConnection = () => postgres(process.env.DATABASE_URL ?? "");

const conn = createConnection();

export const db = drizzle(conn, { schema });
