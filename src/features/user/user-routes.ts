import { Hono } from "hono";
import UserController from "./user-controller";

export const userRouter = new Hono();

userRouter.post("/auth", UserController.signUp);
userRouter.get("/trending-tokens", UserController.getTrendingTokens);
