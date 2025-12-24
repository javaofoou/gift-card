const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const userRoutes = require("../routes/user");
const adminRoutes = require("../routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ success: true });
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

module.exports = serverless(app);

