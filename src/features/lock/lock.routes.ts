import { Hono } from "hono";
import LockController from "./lock.controller";

export const lockRouter = new Hono();

// Create a new lock
lockRouter.post("/create-lock", LockController.createLock);

// Get all locks for a specific user
lockRouter.get("/get-locks/:userId", LockController.getLocksByUser);

// Get a specific lock by ID
lockRouter.get("get-lock/:lockId", LockController.getLockById);

lockRouter.get("/leaderboard-stats", LockController.getLeaderBoardStats);
