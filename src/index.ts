require("dotenv").config();
("use strict");

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import crons from "./configs/cron-jobs";
import { connectDB } from "./configs/database";
import { initializeSocket } from "./configs/socket";
import { routers } from "./utils/routers";
import BlockchainUtils from "./utils/blockchain-utils";
import { cors } from "hono/cors";

const app = new Hono();
app.use(cors());
const port = process.env.PORT || 8080;

const server = serve({
  fetch: app.fetch,
  port: Number(port),
});

console.log(`Server is running on port ${port}`);

connectDB();
crons.initializeCronJobs();
initializeSocket(server);

BlockchainUtils.loadBlockchain();

routers.forEach((router) => {
  app.route("/", router);
});
