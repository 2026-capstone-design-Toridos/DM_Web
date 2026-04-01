# Style Is You - 쇼핑몰

여성의류 쇼핑몰 프로젝트 (Node.js + Express)
link: https://toridos.vercel.app/

## 프로젝트 구조

```
project/
├── server.js              # Express 서버 진입점
├── routes/
│   ├── products.js        # 상품 조회, 좋아요, 장바구니 API
│   ├── orders.js          # 주문 생성, 결제 처리 API
│   └── logs.js            # 유저 행동 로그 수집 API
├── data/
│   └── products.js        # 상품 목데이터 (DB 없음)
├── middleware/
│   └── logger.js          # 로그 파일 저장 미들웨어
├── logs/                  # 로그 파일 저장 폴더 (자동 생성)
│   ├── access_YYYY-MM-DD.json     # API 요청 로그
│   ├── event_YYYY-MM-DD.json      # 유저 행동 이벤트
│   ├── product_view_YYYY-MM-DD.json
│   ├── order_YYYY-MM-DD.json      # 주문/결제 로그
│   └── session_YYYY-MM-DD.json
└── public/
    └── index.html         # 프론트엔드
```

## 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 서버 실행

```bash
# 일반 실행
npm start

# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev
```

### 3. 브라우저에서 접속

```
http://localhost:3001
```

## API 목록

| Method | URL | 설명 |
|--------|-----|------|
| GET | /api/health | 서버 상태 확인 |
| GET | /api/products | 상품 목록 (필터/정렬/검색/페이징) |
| GET | /api/products/:id | 상품 상세 |
| POST | /api/products/:id/like | 좋아요 토글 |
| POST | /api/products/:id/cart | 장바구니 담기 로그 |
| POST | /api/orders | 주문 생성 |
| POST | /api/orders/:orderId/payment | 결제 처리 (더미) |
| GET | /api/orders/:orderId | 주문 조회 |
| POST | /api/logs/event | 유저 이벤트 로그 |
| POST | /api/logs/session | 세션 시작 로그 |

## 로그 파일

`logs/` 폴더에 날짜별로 JSON 파일이 자동 생성됩니다.

수집되는 로그:
- **접속 로그**: 모든 API 요청, 응답 시간, IP
- **상품 조회**: 카테고리 필터, 검색 키워드, 조회 상품
- **장바구니**: 담은 상품, 사이즈, 수량
- **주문/결제**: 주문 금액, 결제 수단, 거래 ID
- **유저 행동**: 페이지뷰, 클릭, 검색, 좋아요
- **세션**: 유입 경로, 기기 정보

## 결제 테스트

더미 결제로 구현되어 있습니다.

- **카드 결제**: 16자리 카드번호 입력 시 결제 성공
- **계좌이체/카카오페이**: 버튼 클릭 시 바로 성공 처리
