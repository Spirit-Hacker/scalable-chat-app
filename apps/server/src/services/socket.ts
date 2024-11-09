import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: "",
  port: "",
  username: "",
  password: "",
});

const sub = new Redis({
  host: "",
  port: "",
  username: "",
  password: "",
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Socket server is running...");
    this._io = new Server({
      cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        allowedHeaders: "*",
      },
    });

    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("Initialize Socket Listeners...");

    io.on("connect", (socket) => {
      console.log(`New Socket Connected ${socket.id}`);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log(`New message received from ${socket.id}: ${message}`);
        // publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("New message received from redis: ", message);
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
