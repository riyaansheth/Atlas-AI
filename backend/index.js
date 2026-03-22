require("dotenv").config();
const express = require("express");
const cors = require("cors");
const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", chatRouter);

app.listen(PORT, () => {
  console.log(`Atlas AI server running on http://localhost:${PORT}`);
});
