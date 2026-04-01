const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const products = require("../data/products");
const { appendLog } = require("../logger");

// 메모리 내 주문 저장 (DB 없음)
const orders = [];

// POST /api/orders - 주문 생성
router.post("/", (req, res) => {
  const { items, shipping, payment } = req.body;

  // 유효성 검사
  if (!items || items.length === 0) {
    return res.status(400).json({ error: "주문 상품이 없습니다" });
  }
  if (!shipping || !shipping.name || !shipping.phone || !shipping.address) {
    return res.status(400).json({ error: "배송 정보를 입력해주세요" });
  }
  if (!payment || !payment.method) {
    return res.status(400).json({ error: "결제 수단을 선택해주세요" });
  }

  // 주문 금액 계산 (서버에서 재계산 - 조작 방지)
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = products.find((p) => p.id === Number(item.productId));
    if (!product) {
      return res.status(400).json({ error: `상품 ID ${item.productId}를 찾을 수 없습니다` });
    }
    if (product.stock < item.qty) {
      return res.status(400).json({ error: `${product.name} 재고가 부족합니다` });
    }

    const unitPrice = product.salePrice || product.price;
    const subtotal = unitPrice * item.qty;
    totalAmount += subtotal;

    orderItems.push({
      productId: product.id,
      productName: product.name,
      size: item.size,
      color: item.color,
      qty: item.qty,
      unitPrice,
      subtotal,
    });
  }

  // 배송비 계산 (5만원 이상 무료)
  const shippingFee = totalAmount >= 50000 ? 0 : 3000;
  const finalAmount = totalAmount + shippingFee;

  const orderId = "ORD-" + uuidv4().split("-")[0].toUpperCase();
  const order = {
    orderId,
    status: "결제대기",
    items: orderItems,
    shipping,
    payment: {
      method: payment.method,
      status: "대기",
    },
    totalAmount,
    shippingFee,
    finalAmount,
    createdAt: new Date().toISOString(),
    sessionId: req.headers["x-session-id"] || null,
  };

  orders.push(order);

  // 주문 생성 로그
  appendLog("order", {
    event: "order_created",
    orderId,
    itemCount: orderItems.length,
    totalAmount,
    shippingFee,
    finalAmount,
    paymentMethod: payment.method,
    sessionId: req.headers["x-session-id"] || null,
  });

  res.status(201).json({
    success: true,
    orderId,
    totalAmount,
    shippingFee,
    finalAmount,
    items: orderItems,
  });
});

// POST /api/orders/:orderId/payment - 결제 처리 (더미)
router.post("/:orderId/payment", (req, res) => {
  const { orderId } = req.params;
  const { paymentData } = req.body;

  const order = orders.find((o) => o.orderId === orderId);
  if (!order) {
    return res.status(404).json({ error: "주문을 찾을 수 없습니다" });
  }
  if (order.status !== "결제대기") {
    return res.status(400).json({ error: "이미 처리된 주문입니다" });
  }

  // 더미 결제 처리 (실제에선 PG사 API 호출)
  // 카드번호 유효성 간단 체크 (테스트용)
  if (order.payment.method === "card") {
    if (!paymentData?.cardNumber || paymentData.cardNumber.replace(/\s/g, "").length !== 16) {
      return res.status(400).json({ error: "카드번호를 확인해주세요" });
    }
  }

  // 결제 성공 처리
  order.status = "결제완료";
  order.payment.status = "완료";
  order.payment.paidAt = new Date().toISOString();
  order.payment.transactionId = "TXN-" + uuidv4().split("-")[0].toUpperCase();

  // 결제 완료 로그
  appendLog("order", {
    event: "payment_completed",
    orderId,
    transactionId: order.payment.transactionId,
    finalAmount: order.finalAmount,
    paymentMethod: order.payment.method,
    sessionId: req.headers["x-session-id"] || null,
  });

  res.json({
    success: true,
    orderId,
    transactionId: order.payment.transactionId,
    status: "결제완료",
    paidAt: order.payment.paidAt,
    finalAmount: order.finalAmount,
  });
});

// GET /api/orders/:orderId - 주문 조회
router.get("/:orderId", (req, res) => {
  const order = orders.find((o) => o.orderId === req.params.orderId);
  if (!order) return res.status(404).json({ error: "주문을 찾을 수 없습니다" });
  res.json(order);
});

module.exports = router;
