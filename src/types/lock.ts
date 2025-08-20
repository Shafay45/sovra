import { Types } from "mongoose";

export interface ILock {
    lockId: number;
    amount: number;
    unlockTime: number;
    user:  Types.ObjectId;
    isCooledDown: boolean;
    isWithdrawn: boolean;
    earnedPoints: number;
    transactionHash: string;
    blockNumber: number;
    coolDownTransactionHash: string;
    withdrawTransactionHash: string;
    claimedReferalPoints: number;
    claimableReferalPoints: number;
    createdAt: Date;
}