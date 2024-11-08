import http from "http";
import SocketService from "./services/socket";

function init() {
  const socketService = new SocketService();

  const httpServer = http.createServer();
  const PORT = process.env.PORT || 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });

  socketService.initListeners();
}

init();
