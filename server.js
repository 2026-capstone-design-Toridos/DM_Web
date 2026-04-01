const express = require("express");
const cors = require("cors");
const path = require("path");

const { requestLogger } = require("./logger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ⭐ static 먼저
app.use(express.static(path.join(__dirname, "public")));

// API
app.get("/api/test", (req, res) => {
  res.json({ message: "API OK" });
});

// ❗ 마지막에 404
app.use((req, res) => {
  res.status(404).send("Not Found");
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

// 로그 (이벤트)
app.post("/api/logs/event", (req, res) => {
  console.log("EVENT LOG:", req.body);
  res.json({ ok: true });
});