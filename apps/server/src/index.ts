import dotenv from "dotenv";
dotenv.config();

import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";
import { app } from "./app";

function init() {
  startMessageConsumer();
  const socketService = new SocketService();

  const httpServer = http.createServer(app);
  const PORT = process.env.PORT || 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, async() => {
    console.log(`Server running on PORT: ${PORT}`);
  });

  socketService.initListeners();
}

init();
