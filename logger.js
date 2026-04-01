const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const LOG_DIR = path.join(__dirname, "../logs");

// 로그 디렉토리 없으면 생성
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function getLogFilePath(type) {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.join(LOG_DIR, `${type}_${date}.json`);
}

function appendLog(type, data) {
  const filePath = getLogFilePath(type);
  const entry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    ...data,
  };

  let logs = [];
  if (fs.existsSync(filePath)) {
    try {
      logs = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
      logs = [];
    }
  }

  logs.push(entry);
  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
  return entry;
}

// 요청 로그 미들웨어 (모든 API 요청 자동 기록)
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    appendLog("access", {
      method: req.method,
      path: req.path,
      query: req.query,
      statusCode: res.statusCode,
      responseTime: Date.now() - start,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      sessionId: req.headers["x-session-id"] || null,
    });
  });
  next();
}

module.exports = { appendLog, requestLogger };
