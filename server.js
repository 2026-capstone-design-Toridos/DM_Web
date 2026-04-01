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