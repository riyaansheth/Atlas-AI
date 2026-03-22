const express = require("express");
const router = express.Router();
const { generateResponse } = require("../gemini");

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Message is required." });
  }

  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = days[now.getDay()];
  const currentTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  try {
    const reply = await generateResponse(message.trim(), currentDay, currentTime);
    return res.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return res.status(500).json({ error: "Failed to get response from AI. Please try again." });
  }
});

module.exports = router;
