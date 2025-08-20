import { ILock } from "../../types/lock";
import UserService from "../user/user-model";
import UserModel from "../user/user-schema";
import LockModel from "./lock.schema";

namespace LockService {
  /**
   * Create a new lock
   */
  export const createLock = async (
    lockData: Partial<ILock>
  ): Promise<ILock> => {
    try {
      const createdLock = await LockModel.create(lockData);
      console.log("createdLock", createdLock);
      return createdLock;
    } catch (error: any) {
      throw error;
    }
  };

  /**
   * Get all locks for a specific user
   */
  export const getLocksByUser = async (userId: string): Promise<ILock[]> => {
    try {
      return await LockModel.find({ user: userId }).sort({ createdAt: -1 });
    } catch (error: any) {
      throw error;
    }
  };

  /**
   * Get a specific lock by ID
   */
  export const getLockById = async (lockId: string): Promise<ILock | null> => {
    try {
      return await LockModel.findById(lockId);
    } catch (error: any) {
      throw error;
    }
  };
  export const updateLockFromEvent = async (eventData: {
    transactionHash: string;
    blockNumber: number;
    walletAddress: string;
    lockId: number;
    amount: number;
    unlockTime: number;
  }): Promise<ILock> => {
    const {
      transactionHash,
      blockNumber,
      walletAddress,
      lockId,
      amount,
      unlockTime,
    } = eventData;

    try {
      // 1️⃣ Try updating by transaction hash
      let updatedLock = await LockModel.findOneAndUpdate(
        { transactionHash: transactionHash.toLowerCase() },
        {
          $set: {
            lockId,
            amount,
            unlockTime,
            blockNumber,
          },
        },
        { new: true }
      );

      if (updatedLock) {
        return updatedLock; // Found and updated
      }

      // 2️⃣ If not found, find the user by wallet address
      const user = await UserService.createOrGet(walletAddress.toLowerCase());
      if (!user) {
        throw new Error(`User with wallet address ${walletAddress} not found`);
      }

      // 3️⃣ Create the lock document with complete data
      const newLock = await LockModel.create({
        lockId,
        amount,
        unlockTime,
        user: user._id,
        isCooledDown: false,
        isWithdrawn: false,
        earnedPoints: 0,
        transactionHash: transactionHash.toLowerCase(),
        blockNumber,
      });

      return newLock;
    } catch (error: any) {
      throw error;
    }
  };

  export const updateCoolDownFlagForLock = async (
    walletAddress: string,
    lockId: number,
    coolDownTransactionHash: string,
    blockNumber: number
  ): Promise<ILock | null> => {
    try {
      const user = await UserModel.findOne({
        walletAddress: walletAddress.toLowerCase(),
      });

      if (!user) {
        throw new Error(`User not found for wallet: ${walletAddress}`);
      }

      const updatedLock = await LockModel.findOneAndUpdate(
        { user: user._id, lockId: lockId },
        {
          isCooledDown: true,
          coolDownTransactionHash: coolDownTransactionHash || null,
          blockNumber,
        },
        { new: true }
      );

      if (!updatedLock) {
        throw new Error(
          `Lock not found for user ${user._id} with lockId ${lockId}`
        );
      }

      return updatedLock;
    } catch (error) {
      console.error("Error starting cooldown:", error);
      throw error;
    }
  };

  export const updateDailyEarnedPoints = async (amountPerPoint: number = 2) => {
    try {
      const currentTimestamp = Math.floor(Date.now() / 1000);

      // 1️⃣ Find active locks
      const activeLocks = await LockModel.find({
        isCooledDown: false,
        blockNumber: { $gt: 0 },
        unlockTime: { $gt: currentTimestamp },
      });
      console.log("activeLocks", activeLocks);
      if (!activeLocks.length) {
        console.log("No active locks found for earned points update.");
        return;
      }

      // 2️⃣ Update earnedPoints for locks
      const bulkOps = await Promise.all(
        activeLocks.map(async (lock) => {
          const additionalPoints = lock.amount / amountPerPoint;
          const lockPeriod = lock.unlockTime - lock.createdAt.getTime() / 1000;
          const lockedDays = Math.floor(lockPeriod / 86400);

          let timeMultiplier = 1;
          if (lockedDays >= 30) {
            timeMultiplier = 1 + (lockedDays / 365) * 0.5;
          }

          const additionalPointsWithTimeMultiplier =
            additionalPoints * timeMultiplier;

          console.log(
            "additionalPointsWithTimeMultiplier",
            additionalPointsWithTimeMultiplier
          );

          const referredUsers = await UserService.getReferredUsers(
            lock.user.toString()
          );
          console.log("referredUsers", referredUsers.length);
          const extraMultiplier = referredUsers.length > 0 ? 2 : 1;
          console.log("extraMultiplier", extraMultiplier);
          const totalSovraPoints =
            additionalPointsWithTimeMultiplier * extraMultiplier;
          const pointsEarnedByReferredUsers =
            totalSovraPoints - additionalPointsWithTimeMultiplier;
          return {
            updateOne: {
              filter: { _id: lock._id },
              update: {
                $inc: {
                  earnedPoints: additionalPointsWithTimeMultiplier,
                  claimableReferalPoints: pointsEarnedByReferredUsers,
                },
              },
            },
          };
        })
      );

      if (bulkOps.length > 0) {
        const result = await LockModel.bulkWrite(bulkOps);
        console.log(`Updated earned points for ${result.modifiedCount} locks.`);
      }

      // 3️⃣ Aggregate earnedPoints per user
      const userPoints = await LockModel.aggregate([
        {
          $group: {
            _id: "$user", // group by user id
            totalPoints: { $sum: "$earnedPoints" },
          },
        },
      ]);

      // 4️⃣ Update sovraPoints in UserModel
      const userBulkOps = userPoints.map((user) => ({
        updateOne: {
          filter: { _id: user._id },
          update: { $set: { sovraPoints: user.totalPoints } },
        },
      }));
      if (userBulkOps.length > 0) {
        const userResult = await UserModel.bulkWrite(userBulkOps);
        console.log(
          `Updated sovraPoints for ${userResult.modifiedCount} users.`
        );
      }
    } catch (error) {
      console.error("Error updating earned points:", error);
    }
  };
}

export default LockService;
