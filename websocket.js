const WebSocket = require("ws");
const { startFFmpegProcess } = require("./videoProcessor");

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection");
    const ffmpegProcess = startFFmpegProcess();

    let buffer = Buffer.alloc(0);

    ffmpegProcess.stdout.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      while (true) {
        // MJPEG frame boundaries
        const start = buffer.indexOf(Buffer.from([0xff, 0xd8])); // Start of JPEG
        const end = buffer.indexOf(Buffer.from([0xff, 0xd9])); // End of JPEG

        if (start !== -1 && end !== -1) {
          const frame = buffer.slice(start, end + 2);
          buffer = buffer.slice(end + 2); // Remaining data

          if (frame.length > 0) {
            ws.send(frame); // Send full JPEG frame to the client
          }
        } else {
          // If no complete frame, wait for more data
          break;
        }
      }
    });

    ffmpegProcess.stderr.on("data", (data) => {
      console.error("FFmpeg error:", data.toString());
    });

    ws.on("close", () => {
      console.log("WebSocket disconnected");
      ffmpegProcess.kill();
    });
  });
}

module.exports = {
  setupWebSocketServer,
};
