import Web3 from "web3";
import BlockchainUtils from "./blockchain-utils";
import { ethers } from "ethers";
import { ABI } from "../constants/lockAbi";
import LockService from "../features/lock/lock.model";

namespace BlockchainEventListeners {
  export const LockEventListener = async (
    contractAddress: string,
    topic: string,
    web3socket: Web3,
    fromBlock: number,
    toBlock: string
  ) => {
    try {
      const subscription = await BlockchainUtils.eventHandler(
        contractAddress,
        topic,
        web3socket,
        fromBlock.toString(),
        toBlock
      );

      subscription.on("data", async (event) => {
        const web3Interface = new ethers.Interface(ABI);
        const data = web3Interface.parseLog(event);
        const transactionHash = event.transactionHash as string;
        const blockNumber = event.blockNumber as number;
        if (!data) return;
        let { user, lockId, amount, unlockTime } = data.args;
        const eventData = {
          transactionHash,
          blockNumber,
          walletAddress: user.toLowerCase(),
          lockId: Number(lockId),
          amount: Number(ethers.formatUnits(amount, 18)),
          unlockTime: Number(unlockTime),
        };
        console.log("eventData", eventData);
        await LockService.updateLockFromEvent(eventData);
      });
    } catch (error: any) {
      console.log("Error", error);
    }
  };

  export const CoolDownEventListener = async (
    contractAddress: string,
    topic: string,
    web3socket: Web3,
    fromBlock: number,
    toBlock: string
  ) => {
    try {
      const subscription = await BlockchainUtils.eventHandler(
        contractAddress,
        topic,
        web3socket,
        fromBlock.toString(),
        toBlock
      );

      subscription.on("data", async (event) => {
        const web3Interface = new ethers.Interface(ABI);
        const data = web3Interface.parseLog(event);
        const transactionHash = event.transactionHash as string;
        const blockNumber = event.blockNumber as number;
        if (!data) return;
        let { user, lockId, cooldownStartTime } = data.args;
        console.log(
          "user",
          user,
          "lockId",
          lockId,
          "cooldownStartTime",
          cooldownStartTime
        );
        await LockService.updateCoolDownFlagForLock(
          user.toLowerCase(),
          Number(lockId),
          transactionHash,
          blockNumber
        );
      });
    } catch (error: any) {
      console.log("Error", error);
    }
  };
}

export default BlockchainEventListeners;
