import Web3 from "web3";
import BlockchainEventListeners from "./blockchain-event-listeners";
import env from "../constants/environment";
import LockModel from "../features/lock/lock.schema";

namespace BlockchainUtils {
  export const loadBlockchain = async () => {
    try {
      const web3Socket = new Web3(
        new Web3.providers.WebsocketProvider(env.SOCKET_URL[env.DEFAULT_CHAIN])
      );
            const latestBlock = await LockModel.findOne()
        .sort({ blockNumber: -1 })
        .limit(1)
        .exec();
        console.log("latestBlock", latestBlock);
      await BlockchainEventListeners.LockEventListener(
        env.CONTRACT_ADDRESS[env.DEFAULT_CHAIN],
        env.TOPIC,
        web3Socket,
         latestBlock?.blockNumber||env.BLOCK_NUMBER[env.DEFAULT_CHAIN],
        "latest"
      );
      await BlockchainEventListeners.CoolDownEventListener(
        env.CONTRACT_ADDRESS[env.DEFAULT_CHAIN],
        env.COOL_DOWN_TOPIC,
        web3Socket,
         latestBlock?.blockNumber||
         env.BLOCK_NUMBER[env.DEFAULT_CHAIN],
        "latest"
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  export const eventHandler = async (
    address: string,
    topic: string,
    web3Socket: Web3,
    from: string,
    to: string
  ) => {
    let options = {
      fromBlock: from,
      toBlock: to,
      address: address, // Only get events from specific addresses
      topics: [topic], // What topics to subscribe to
    };
    const subscription = web3Socket.eth.subscribe("logs", options);

    return subscription;
  };
}

export default BlockchainUtils;
