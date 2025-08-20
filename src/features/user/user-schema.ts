import env from "../../constants/environment";
import { Schema, model } from "mongoose";
import IUser from "../../types/user";

let userSchema = new Schema<IUser>(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    sovraPoints: {
      type: Number,
      default: 0,
    },
    referCode: {
      type: String,
      unique: true,
      required: true,
    },
    referedBy: {
      type: Schema.Types.ObjectId,
      ref: `${env.PROJECT_NAME}-users`,
      default: null,
      
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model(`${env.PROJECT_NAME}-users`, userSchema);

export default UserModel;
