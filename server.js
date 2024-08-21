const express = require("express");
const http = require("http");
const path = require("path");
const { setupWebSocketServer } = require("./websocket");

const app = express();
const server = http.createServer(app);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Set up WebSocket server
setupWebSocketServer(server);

// Start the server
const PORT = process.env.PORT || 8331;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
