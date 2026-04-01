const { v4: uuidv4 } = require("uuid");

function appendLog(type, data) {
  const entry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    ...data,
  };

  console.log(`[${type}]`, entry);
  return entry;
}

// 요청 로그 미들웨어
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    appendLog("access", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: Date.now() - start,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  });

  next();
}

module.exports = { appendLog, requestLogger };