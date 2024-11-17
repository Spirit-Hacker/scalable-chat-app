import dotenv from "dotenv";
dotenv.config();

import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";

function init() {
  startMessageConsumer();
  const socketService = new SocketService();

  const httpServer = http.createServer();
  const PORT = process.env.PORT || 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, async() => {
    console.log(`Server running on PORT: ${PORT}`);
  });

  socketService.initListeners();
}

init();
