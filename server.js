const express = require("express");
const cors = require("cors");

const { requestLogger } = require("./logger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// 테스트 API
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API OK" });
});

// 404 처리 (중요)
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// ✅ Vercel 대응
module.exports = app;

// ✅ 로컬 실행용
if (require.main === module) {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}