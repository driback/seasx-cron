import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var __dbConn: postgres.Sql | undefined;
}

const createConnection = () =>
  postgres(process.env.DATABASE_URL ?? "", { max: 1, idle_timeout: 2 });

const conn = createConnection();

export const db = drizzle(conn, { schema });
