import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { timeout } from "hono/timeout";
import { afreecaTvController } from "./controller/afreecatv/route";

const TIMEOUT = 60000;

const app = new Hono().basePath("/cron");

app.use("/afreecatv", timeout(TIMEOUT));

app.get("/afreecatv", afreecaTvController);

const port = Number(process.env.PORT) ?? 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
