
import { Server } from "socket.io";
import env from "../constants/environment";

let io: Server = new Server();

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: env.WHITE_LIST,
      methods: ["GET", "POST"],
    },
  });

  channel();
};

const channel = async () => {
  io.on("connection", async (socket) => {
    // Listen here
    // socket.on("event", callback);
  });
};

export default io;
