const express = require("express");
const router = express.Router();
const products = require("../data/products");
const { appendLog } = require("../logger");

// GET /api/products - 전체 상품 목록 (필터/정렬 지원)
router.get("/", (req, res) => {
  const { category, sort, search, page = 1, limit = 12 } = req.query;

  let result = [...products];

  // 카테고리 필터
  if (category && category !== "전체") {
    result = result.filter((p) => p.category === category);
  }

  // 검색
  if (search) {
    result = result.filter(
      (p) => p.name.includes(search) || p.category.includes(search)
    );
  }

  // 정렬
  if (sort === "price_asc") result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  else if (sort === "price_desc") result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  else if (sort === "popular") result.sort((a, b) => b.reviewCount - a.reviewCount);
  else result.sort((a, b) => b.id - a.id); // 최신순 기본

  // 페이징
  const total = result.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = result.slice(start, start + Number(limit));

  // 조회 로그
  appendLog("product_view", {
    event: "product_list",
    category: category || "전체",
    sort: sort || "newest",
    search: search || null,
    page: Number(page),
    resultCount: total,
    sessionId: req.headers["x-session-id"] || null,
  });

  res.json({
    products: paginated,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

// GET /api/products/:id - 상품 상세
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "상품을 찾을 수 없습니다" });

  // 상품 상세 조회 로그
  appendLog("product_view", {
    event: "product_detail",
    productId: product.id,
    productName: product.name,
    category: product.category,
    sessionId: req.headers["x-session-id"] || null,
  });

  res.json(product);
});

// POST /api/products/:id/like - 좋아요 토글
router.post("/:id/like", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "상품을 찾을 수 없습니다" });

  const { liked } = req.body;

  appendLog("user_action", {
    event: "product_like",
    productId: product.id,
    productName: product.name,
    liked,
    sessionId: req.headers["x-session-id"] || null,
  });

  res.json({ success: true, productId: product.id, liked });
});

// POST /api/products/:id/cart - 장바구니 담기 로그
router.post("/:id/cart", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "상품을 찾을 수 없습니다" });

  const { size, color, qty } = req.body;

  appendLog("user_action", {
    event: "add_to_cart",
    productId: product.id,
    productName: product.name,
    price: product.salePrice || product.price,
    size,
    color,
    qty,
    sessionId: req.headers["x-session-id"] || null,
  });

  res.json({ success: true });
});

module.exports = router;
