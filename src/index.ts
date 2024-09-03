import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { afreecaTvController } from "./controller/afreecatv/route";

const app = new Hono().basePath("/cron");

app.get("/afreecatv", afreecaTvController);
app.get("/tiktok", afreecaTvController);

const port = Number(process.env.PORT) ?? 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
