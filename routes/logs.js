const express = require("express");
const router = express.Router();
const { appendLog } = require("../logger");

// POST /api/logs/event - 프론트에서 유저 행동 이벤트 수집
router.post("/event", (req, res) => {
  const { event, data } = req.body;

  if (!event) return res.status(400).json({ error: "event 필드가 필요합니다" });

  const allowed = [
    "page_view",
    "product_click",
    "add_to_cart",
    "remove_from_cart",
    "begin_checkout",
    "search",
    "filter_change",
    "product_like",
    "session_start",
  ];

  if (!allowed.includes(event)) {
    return res.status(400).json({ error: "허용되지 않는 이벤트입니다" });
  }

  const entry = appendLog("event", {
    event,
    ...data,
    sessionId: req.headers["x-session-id"] || data?.sessionId || null,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.json({ success: true, id: entry.id });
});

// POST /api/logs/session - 세션 시작 기록
router.post("/session", (req, res) => {
  const { sessionId, referrer, device } = req.body;

  appendLog("session", {
    event: "session_start",
    sessionId,
    referrer: referrer || null,
    device: device || null,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.json({ success: true, sessionId });
});

module.exports = router;
