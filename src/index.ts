import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { timeout } from "hono/timeout";
import { afreecaTvController } from "./controller/afreecatv/route";

const TIMEOUT = 50000;

const app = new Hono().basePath("/cron");

app.use("/afreecatv", timeout(TIMEOUT));

app.get("/afreecatv", afreecaTvController);

console.log(`Server is running`);

serve(app);
