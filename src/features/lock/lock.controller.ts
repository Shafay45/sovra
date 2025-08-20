import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ILock } from "../../types/lock";
import LockService from "./lock.model";
import UserModel from "../user/user-schema";
import LockModel from "./lock.schema";

namespace LockController {
  /**
   * Create a new lock
   */
  export const createLock = async (ctx: Context) => {
    try {
      const lockData: Partial<ILock> = await ctx.req.json();

      const createdLock = await LockService.createLock(lockData);

      return ctx.json({
        response: "success",
        data: createdLock,
      });
    } catch (error: any) {
      throw new HTTPException(500, { message: error?.message ?? error });
    }
  };

  /**
   * Get all locks for a specific user
   */
  export const getLocksByUser = async (ctx: Context) => {
    try {
      const { userId } = ctx.req.param();
      const locks = await LockService.getLocksByUser(userId);

      return ctx.json({
        response: "success",
        data: locks,
      });
    } catch (error: any) {
      throw new HTTPException(500, { message: error?.message ?? error });
    }
  };

  /**
   * Get a specific lock by ID
   */
  export const getLockById = async (ctx: Context) => {
    try {
      const { lockId } = ctx.req.param();
      const lock = await LockService.getLockById(lockId);

      if (!lock) {
        throw new HTTPException(404, { message: "Lock not found" });
      }

      return ctx.json({
        response: "success",
        data: lock,
      });
    } catch (error: any) {
      throw new HTTPException(500, { message: error?.message ?? error });
    }
  };


  export const getLeaderBoardStats = async (ctx: Context) => {
  try {
    // 1️⃣ Fetch all users
    const users = await UserModel.find({}).lean();

    if (!users.length) {
      throw new HTTPException(404, { message: "No users found" });
    }

    // 2️⃣ Get all locks for all users
    const userIds = users.map(u => u._id);
    const locks = await LockModel.find({ user: { $in: userIds } }).lean();

    // 3️⃣ Map user stats
    const data = users.map(user => {
      const userLocks = locks.filter(lock => lock.user.toString() === user._id.toString());

      const sovraStaked = userLocks
        .filter(lock => !lock.isWithdrawn)
        .reduce((sum, lock) => sum + lock.amount, 0);


      return {
        account: user.walletAddress,
        sovraStaked,
        sovraPoints: user.sovraPoints || 0
      };
    });

    return ctx.json({
      response: "success",
      data
    });

  } catch (error: any) {
    throw new HTTPException(500, { message: error?.message ?? error });
  }
};
}

export default LockController;
