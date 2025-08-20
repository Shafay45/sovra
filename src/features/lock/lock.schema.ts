import env from "../../constants/environment";
import { Schema, model } from "mongoose";
import { ILock } from "../../types/lock"; // Assuming you saved your interface here

const lockSchema = new Schema<ILock>(
  {
    lockId: {
      type: Number,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    unlockTime: {
      type: Number,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: `${env.PROJECT_NAME}-users`,
      required: true,
    },
    isCooledDown: {
      type: Boolean,
      default: false,
    },
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
    earnedPoints: {
      type: Number,
      default: 0,
    },
    transactionHash: {
      type: String,
      required: true,
      toLowerCase: true,
      unique: true,
    },
    coolDownTransactionHash: {
      type: String,
      default: null,
      toLowerCase: true,
      unique: true,
    },
    withdrawTransactionHash: {
      type: String,
      default: null,
      toLowerCase: true,
      unique: true,
    },
    blockNumber: {
      type: Number,
      default: null,
    },
    claimableReferalPoints: {
      type: Number,
      default: 0,
    },
    claimedReferalPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
lockSchema.index(
  { coolDownTransactionHash: 1 },
  {
    unique: true,
    partialFilterExpression: { coolDownTransactionHash: { $type: "string" } },
  }
);

lockSchema.index(
  { withdrawTransactionHash: 1 },
  {
    unique: true,
    partialFilterExpression: { withdrawTransactionHash: { $type: "string" } },
  }
);
const LockModel = model(`${env.PROJECT_NAME}-locks`, lockSchema);

export default LockModel;
