import http from "http";

function init() {
  const httpServer = http.createServer();
  const PORT = process.env.PORT || 8000;

  httpServer.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
}

init();
