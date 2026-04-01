const products = [
  {
    id: 1,
    name: "플로럴 미디 원피스",
    category: "원피스",
    price: 52000,
    salePrice: 39000,
    emoji: "👗",
    badge: "BEST",
    stock: 50,
    colors: [
      { name: "핑크", hex: "#f4a7b9" },
      { name: "블루", hex: "#a8c5da" },
      { name: "베이지", hex: "#c8b8a2" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "봄/여름 시즌 베스트셀러. 플로럴 패턴의 미디 원피스로 데일리룩으로 완성하세요.",
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: 2,
    name: "린넨 와이드 팬츠",
    category: "하의",
    price: 48000,
    salePrice: null,
    emoji: "👖",
    badge: null,
    stock: 30,
    colors: [
      { name: "베이지", hex: "#e8d5b7" },
      { name: "블랙", hex: "#4a4a4a" },
      { name: "브라운", hex: "#8b7355" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "시원한 린넨 소재의 와이드 팬츠. 편안한 착용감으로 여름을 시원하게.",
    rating: 4.5,
    reviewCount: 87
  },
  {
    id: 3,
    name: "크롭 가디건",
    category: "상의",
    price: 36000,
    salePrice: 28000,
    emoji: "🧥",
    badge: "SALE",
    stock: 25,
    colors: [
      { name: "화이트", hex: "#ffffff" },
      { name: "핑크", hex: "#f4a7b9" },
      { name: "베이지", hex: "#c8b8a2" }
    ],
    sizes: ["S", "M", "L"],
    description: "크롭 기장의 니트 가디건. 레이어드 스타일링에 완벽.",
    rating: 4.6,
    reviewCount: 63
  },
  {
    id: 4,
    name: "트위드 재킷",
    category: "아우터",
    price: 98000,
    salePrice: null,
    emoji: "🧣",
    badge: "NEW",
    stock: 20,
    colors: [
      { name: "베이지", hex: "#c8b8a2" },
      { name: "블랙", hex: "#4a4a4a" },
      { name: "브라운", hex: "#8b7355" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "클래식 트위드 소재 재킷. 격식있는 자리에서도 캐주얼하게도 연출 가능.",
    rating: 4.9,
    reviewCount: 41
  },
  {
    id: 5,
    name: "스트라이프 블라우스",
    category: "상의",
    price: 42000,
    salePrice: 35000,
    emoji: "👚",
    badge: null,
    stock: 40,
    colors: [
      { name: "화이트", hex: "#ffffff" },
      { name: "블랙", hex: "#4a4a4a" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "깔끔한 스트라이프 패턴 블라우스. 오피스룩으로 추천.",
    rating: 4.4,
    reviewCount: 95
  },
  {
    id: 6,
    name: "A라인 미니스커트",
    category: "하의",
    price: 32000,
    salePrice: null,
    emoji: "👗",
    badge: null,
    stock: 35,
    colors: [
      { name: "핑크", hex: "#f4a7b9" },
      { name: "블랙", hex: "#4a4a4a" },
      { name: "베이지", hex: "#c8b8a2" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "A라인 실루엣의 미니스커트. 어떤 상의와도 잘 어울립니다.",
    rating: 4.3,
    reviewCount: 72
  },
  {
    id: 7,
    name: "오버핏 후드집업",
    category: "아우터",
    price: 58000,
    salePrice: 46000,
    emoji: "🧥",
    badge: "SALE",
    stock: 45,
    colors: [
      { name: "블루", hex: "#a8c5da" },
      { name: "블랙", hex: "#4a4a4a" },
      { name: "베이지", hex: "#e8d5b7" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "편안한 오버핏 후드집업. 데일리 캐주얼의 정석.",
    rating: 4.7,
    reviewCount: 158
  },
  {
    id: 8,
    name: "리본 넥 원피스",
    category: "원피스",
    price: 64000,
    salePrice: null,
    emoji: "👗",
    badge: "NEW",
    stock: 18,
    colors: [
      { name: "핑크", hex: "#f4a7b9" },
      { name: "화이트", hex: "#ffffff" },
      { name: "베이지", hex: "#c8b8a2" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "리본 넥 포인트가 사랑스러운 원피스. 데이트룩으로 완벽.",
    rating: 4.8,
    reviewCount: 56
  },
  {
    id: 9,
    name: "데님 미디 스커트",
    category: "하의",
    price: 45000,
    salePrice: 38000,
    emoji: "👖",
    badge: null,
    stock: 28,
    colors: [
      { name: "블루", hex: "#a8c5da" },
      { name: "블랙", hex: "#4a4a4a" }
    ],
    sizes: ["S", "M", "L"],
    description: "트렌디한 데님 미디 스커트. 캐주얼한 데일리룩에 활용하세요.",
    rating: 4.5,
    reviewCount: 83
  },
  {
    id: 10,
    name: "캐시미어 니트",
    category: "상의",
    price: 82000,
    salePrice: null,
    emoji: "🧶",
    badge: "BEST",
    stock: 22,
    colors: [
      { name: "베이지", hex: "#e8d5b7" },
      { name: "핑크", hex: "#f4a7b9" },
      { name: "브라운", hex: "#c8b8a2" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "100% 캐시미어 소재 니트. 부드럽고 고급스러운 착용감.",
    rating: 4.9,
    reviewCount: 201
  },
  {
    id: 11,
    name: "플리츠 롱스커트",
    category: "하의",
    price: 56000,
    salePrice: 44000,
    emoji: "👗",
    badge: null,
    stock: 33,
    colors: [
      { name: "핑크", hex: "#f4a7b9" },
      { name: "베이지", hex: "#c8b8a2" },
      { name: "블랙", hex: "#4a4a4a" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "우아한 플리츠 롱스커트. 여성스러운 실루엣을 완성합니다.",
    rating: 4.6,
    reviewCount: 49
  },
  {
    id: 12,
    name: "코튼 셔츠 원피스",
    category: "원피스",
    price: 68000,
    salePrice: null,
    emoji: "👘",
    badge: "NEW",
    stock: 15,
    colors: [
      { name: "화이트", hex: "#ffffff" },
      { name: "베이지", hex: "#e8d5b7" },
      { name: "블루", hex: "#a8c5da" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "깔끔한 코튼 셔츠 원피스. 시즌리스 아이템.",
    rating: 4.7,
    reviewCount: 77
  }
];

module.exports = products;
