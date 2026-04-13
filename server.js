const express = require("express");
const cors = require("cors");
const path = require("path");

// const { requestLogger } = require("./logger");

const app = express();
const events = [];

// 중요: CORS 설정 (credentials: true와 origin 명시 필수!)
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "https://toridos.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
// app.use(requestLogger);

// ⭐ static 먼저
app.use(express.static(path.join(__dirname, "public")));

// API
app.get("/api/test", (req, res) => {
  res.json({ message: "API OK" });
});

// Vercel 대응
module.exports = app;

// 로컬 실행
if (require.main === module) {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

// 헬스체크
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 상품 리스트 (임시 데이터)
app.get("/api/products", (req, res) => {
  res.json({
    total: 2,
    totalPages: 1,
    products: [
      {
        id: 1,
        name: "로맨틱 원피스",
        price: 39000,
        salePrice: 29000,
        emoji: "👗",
        badge: "SALE",
        sizes: ["S", "M", "L"],
        colors: [{ name: "핑크", hex: "#e8a0b0" }]
      },
      {
        id: 2,
        name: "데일리 니트",
        price: 25000,
        emoji: "🧥",
        sizes: ["S", "M"],
        colors: [{ name: "베이지", hex: "#f5f0eb" }]
      }
    ]
  });
});

// 상품 상세
app.get("/api/products/:id", (req, res) => {
  res.json({
    id: Number(req.params.id),
    name: "샘플 상품",
    price: 30000,
    emoji: "👗",
    sizes: ["S", "M", "L"],
    colors: [{ name: "블랙", hex: "#000" }]
  });
});

// 로그 (세션)
app.post("/api/logs/session", (req, res) => {
  console.log("SESSION LOG:", req.body);
  res.json({ ok: true });
});


// 이벤트 받을 때 저장
app.post('/api/logs/event', (req, res) => {
    const eventData = {
        ...req.body, // SDK가 보낸 데이터 (event_type, data 등)
        timestamp: new Date().toISOString(), // 서버에서 시간 강제 생성
        // 만약 SDK가 session_id를 data 안에 담아 보낸다면 꺼내서 상위로 올림
        sessionId: req.body.session_id || (req.body.data && req.body.data.sessionId) || 'no-session'
    };
    events.push(eventData);
    res.status(201).json({ status: 'success' });
});
// 조회 API 추가
app.get("/api/logs", (req, res) => {
  res.json(events);
});

// like
app.post("/api/products/:id/like", (req, res) => {
  res.json({ ok: true });
});

// cart
app.post("/api/products/:id/cart", (req, res) => {
  res.json({ ok: true });
});

// orders
app.post("/api/orders", (req, res) => {
  res.json({
    orderId: "ORD123",
    items: req.body.items || [],
    shippingFee: 0,
    finalAmount: 30000
  });
});

// payment
app.post("/api/orders/:id/payment", (req, res) => {
  res.json({
    transactionId: "PAY123"
  });
});

// ❗ 마지막에 404
app.use((req, res) => {
  res.status(404).send("Not Found");
});