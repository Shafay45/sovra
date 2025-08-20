import { Types } from "mongoose";
import IUser from "../../types/user";
import UserModel from "../user/user-schema";
import LockModel from "../lock/lock.schema";
namespace ReferService {
  export const updateReferBy = async (
    walletAddress: string,
    referCode: string
  ): Promise<IUser | null> => {
    try {
      // Find the inviter by their referCode
      const inviter = await UserModel.findOne({ referCode });
      if (!inviter) {
        throw new Error("Invalid referral code");
      }
      console.log("inviter", inviter);
      // Update the current user's referBy field
      const updatedUser = await UserModel.findOneAndUpdate(
        { walletAddress: walletAddress.toLowerCase() },
        { referedBy: inviter._id },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.error("Error updating referBy:", error);
      throw error;
    }
  };
export const claimReferralPoints = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  // 1️⃣ Find all locks of this user
  const locks = await LockModel.find({ user: userId }).lean();

  if (!locks.length) {
    throw new Error("No locks found for this user");
  }

  // 2️⃣ Sum claimable referral points
  const totalClaimable = locks.reduce((sum, lock) => sum + (lock.claimableReferalPoints || 0), 0);

  if (totalClaimable <= 0) {
    throw new Error("No claimable referral points found");
  }

  // 3️⃣ Update user sovraPoints
  await UserModel.findByIdAndUpdate(userId, { $inc: { sovraPoints: totalClaimable } });

  // 4️⃣ Move claimable -> claimed in locks
  await Promise.all(
    locks.map(lock => {
      if (lock.claimableReferalPoints > 0) {
        return LockModel.findByIdAndUpdate(lock._id, {
          $inc: { claimedReferalPoints: lock.claimableReferalPoints },
          $set: { claimableReferalPoints: 0 },
        });
      }
    })
  );

  return { totalClaimed: totalClaimable };
};
 export const getReferralsByUserId = async (userId: string) => {
  try {
    // 1️⃣ Validate ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    // 2️⃣ Find all referred users
    const referredUsers = await UserModel.find({ referedBy: userId }).lean();

    if (!referredUsers.length) {
      return [];
    }

    // 3️⃣ Fetch locks & aggregate data for each referred user
    const result = await Promise.all(
      referredUsers.map(async (user) => {
        const locks = await LockModel.find({ user: user._id }).lean();

        const totalStaked = locks.reduce((sum, lock) => sum + Number(lock.amount || 0), 0);
        const totalClaimableReferralPoints = locks.reduce(
          (sum, lock) => sum + Number(lock.claimableReferalPoints || 0),
          0
        );
        const totalClaimedReferralPoints = locks.reduce(
          (sum, lock) => sum + Number(lock.claimedReferalPoints || 0),
          0
        );

        return {
          _id: user._id.toString(),
          walletAddress: user.walletAddress,
          sovraPoints: user.sovraPoints || 0,
          joinDate: user.createdAt, // Keep as Date object; format in frontend
          totalStaked,
          claimableReferalPoints: totalClaimableReferralPoints,
          claimedReferalPoints: totalClaimedReferralPoints,
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Error fetching referrals:", error);
    throw error;
  }
};

}
export default ReferService;
