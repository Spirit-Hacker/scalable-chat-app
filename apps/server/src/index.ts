import dotenv from "dotenv";
dotenv.config();

import http, { Server as HttpServer } from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";
import { app } from "./app";
import connectDB from "./services/db";

function init(): void {
  startMessageConsumer();
  const socketService: SocketService = new SocketService();

  const httpServer: HttpServer = http.createServer(app);
  const PORT: number = parseInt(process.env.PORT || "8000", 10);

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on PORT: ${PORT}`);
  });

  socketService.initListeners();
}

init();
