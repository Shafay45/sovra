namespace env {
  export const WHITE_LIST = [
    "http://localhost:3000",
    "http://localhost:3000/",
    "http://localhost:3001",
    "http://localhost:3001/",
  ];
  export const PROJECT_NAME = "sovra";
  export const DEFAULT_CHAIN: number = 11155111;
  export const CONTRACT_ADDRESS: { [key: number]: string } = {
    8453: "0x000000000000000000000000000000000000000",
    11155111: "0xAD17f5DDA3F70DBDfCf06c64cE9CFd54ec6FB3B9",
  };
  export const SOCKET_URL: { [key: number]: string } = {
    8453: "",
    11155111: "wss://sepolia.infura.io/ws/v3/2b2b802ce8414591a6c76a30cf192ad3",
  };
  export const TOPIC: string =
    "0x90e20a62e0f2a608d33bd96a4e15cb853006a15caf4455f373b7b55de520b68c";
  export const COOL_DOWN_TOPIC: string =
    "0xa4b3d92c67ba96e840c4888c41c81bb378420dfa35fbdcec3c0581372fb06068";
  export const BLOCK_NUMBER: { [key: number]: number } = {
    8453: 0,
    11155111: 8984487,
  };
}

export default env;
