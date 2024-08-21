const { spawn } = require("child_process");

function startFFmpegProcess() {
  const cmd = spawn("ffmpeg", [
    "-rtsp_transport",
    "tcp",
    "-i",
    "rtsp://rtspstream:bf773dee1bab505160ae95a88c1d7585@zephyr.rtsp.stream/movie",
    "-f",
    "mjpeg",
    "-vf",
    "fps=20",
    "-",
  ]);

  return cmd;
}

module.exports = {
  startFFmpegProcess,
};
