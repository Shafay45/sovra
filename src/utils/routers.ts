import { Hono } from "hono";
import { userRouter } from "../features/user/user-routes";
import { lockRouter } from "../features/lock/lock.routes";
import { referralRouter } from "../features/refer/refer.route";

// Add the routers of all features into this array

const rootRouter = new Hono();

rootRouter.get("/", (ctx) => ctx.text("Hello"));

export const routers = [rootRouter, userRouter, lockRouter, referralRouter];
