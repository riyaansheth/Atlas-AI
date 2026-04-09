require("dotenv").config();
const express = require("express");
const cors = require("cors");
const chatRouter = require("./routes/chat");
const authRouter = require("./routes/auth");
const { router: studentRouter } = require("./routes/student");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.options("*", cors());
app.use(express.json());

app.use("/api", chatRouter);
app.use("/auth", authRouter);
app.use("/student", studentRouter);

app.listen(PORT, () => {
  console.log(`Atlas AI server running on http://localhost:${PORT}`);
});