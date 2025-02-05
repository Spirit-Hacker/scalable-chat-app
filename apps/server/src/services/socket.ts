import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import Redis from "ioredis";
import { produceMessage } from "./kafka";
import { v4 as uuidv4 } from "uuid";

const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "0", 10)
});

const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "0", 10)
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Socket server is running...");
    this._io = new Server({
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:5173",
        ],
        allowedHeaders: ["Content-Type", "Authorization"],
      },
    });

    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("Initialize Socket Listeners...");
    const loggedInUsers: Record<string, string> = {};

    io.on("connect", (socket) => {
      console.log(`New Socket Connected ${socket.id}`);

      socket.on(
        "event:message",
        async ({
          message,
          receiverId,
          senderId,
        }: {
          message: string;
          receiverId: string;
          senderId: string;
        }) => {
          console.log(
            `New message received from ${socket.id}: ${message}, : ${receiverId} : ${senderId}`
          );
          // publish this message to redis
          // console.log("loggein info", loggedInUsers);
          const data = {
            message,
            receiverId,
            senderId,
            isReceiverOnline: loggedInUsers[receiverId] ? true : false,
            messageId: uuidv4()
          };
          await pub.publish("MESSAGES", JSON.stringify(data));
        }
      );

      socket.on("login", async (userId) => {
        loggedInUsers[userId] = socket.id;
        console.log("loggein info", loggedInUsers);
        io.emit("users:online", Object.keys(loggedInUsers));
      });

      socket.on("disconnect", async () => {
        console.log(`Socket Disconnected ${socket.id}`);
        const userId = Object.keys(loggedInUsers).find(
          (userId) => loggedInUsers[userId] === socket.id
        );
        if (userId) {
          delete loggedInUsers[userId];
        }
        io.emit("users:online", Object.keys(loggedInUsers));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("New message received from redis: ", message);
        if (loggedInUsers[JSON.parse(message).receiverId]) {
          io.to(loggedInUsers[JSON.parse(message).receiverId]).emit(
            "message",
            JSON.parse(message)
          );
        }
        if (loggedInUsers[JSON.parse(message).senderId]) {
          io.to(loggedInUsers[JSON.parse(message).senderId]).emit(
            "message",
            JSON.parse(message)
          );
        }

        // produce message to kafka broker
        produceMessage(message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
