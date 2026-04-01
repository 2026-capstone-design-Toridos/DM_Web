const express = require("express");
const cors = require("cors");
const path = require("path");
const { requestLogger } = require("./logger");

const app = express();
const PORT = process.env.PORT || 3001;

// ── 미들웨어 ──────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); // 모든 요청 로그 기록

// 정적 파일 (public/index.html)
app.use(express.static(path.join(__dirname, "public")));

// ── API 라우터 ─────────────────────────────────────────
app.use("/api/products", require("./routes/products"));
app.use("/api/orders",   require("./routes/orders"));
app.use("/api/logs",     require("./routes/logs"));

// ── 헬스체크 ──────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── SPA fallback ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// ── 서버 시작 ──────────────────────────────────────────
module.exports = app;
