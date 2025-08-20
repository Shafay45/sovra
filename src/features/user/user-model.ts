import { Types } from "mongoose";
import { ILock } from "../../types/lock";
import IUser from "../../types/user";
import LockModel from "../lock/lock.schema";
import UserModel from "./user-schema";
import { randomBytes } from "crypto";

namespace UserService {
  export const createOrGet = async (
    walletAddress: string
  ): Promise<IUser & { locks: ILock[] }> => {
    try {
      let user = await UserModel.findOne({
        walletAddress: walletAddress.toLowerCase(),
      });

      if (user) {
        // Fetch user's locks
        const locks = await LockModel.find({ user: user._id });
        return { ...user.toObject(), locks };
      }

      // Create new user
      const referCode = randomBytes(8).toString("hex").slice(0, 8);
      const createdUser = await UserModel.create({
        walletAddress: walletAddress.toLowerCase(),
        referCode,
      });
 
 
      console.log("createdUser", createdUser);

      return { ...createdUser.toObject(), locks: [] };
    } catch (error: any) {
      if (error?.code === 11000) {
        throw "Trying to add duplicate account";
      } else {
        throw error;
      }
    }
  };
  export const getReferredUsers = async (userId: string) => {
  try {
    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    // Find all users who were referred by this user
    const referredUsers = await UserModel.find({ referedBy: userId }).lean();

    return referredUsers; // returns array of user objects
  } catch (error) {
    console.error("Error fetching referred users:", error);
    throw error;
  }
};
}

export default UserService;
