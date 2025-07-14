// scripts/logger.js
const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFile = path.join(logDir, "log.txt");

function timestamp() {
  return new Date().toISOString().replace("T", " ").split(".")[0];
}

function log(message) {
  const line = `[${timestamp()}] ${message}`;
  console.log(line);
  fs.appendFileSync(logFile, line + "\n", "utf8");
}

function divider() {
  log("──────────────────────────────────────────");
}

module.exports = { log, divider };
