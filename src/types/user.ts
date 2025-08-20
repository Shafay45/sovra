import { Types } from "mongoose";

interface IUser {
  _id: string;
  walletAddress: string;
  sovraPoints: number;
  referCode: string;
  referedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;
