const express = require("express");
const router = express.Router();
const db = require("../db");
const { generateResponse } = require("../gemini");
const { authMiddleware } = require("./student");

router.post("/chat", authMiddleware, async (req, res) => {
  const { message } = req.body;
  const { student_id } = req.student;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    // Fetch live student data from DB
    const [studentRows] = await db.query(
      "SELECT * FROM students WHERE student_id = ?",
      [student_id]
    );
    const [grades] = await db.query(
      "SELECT * FROM grades WHERE student_id = ? ORDER BY semester",
      [student_id]
    );
    const [attendance] = await db.query(
      "SELECT * FROM attendance WHERE student_id = ?",
      [student_id]
    );

    const student = studentRows[0];

    // Build personalized context
    const gradesSummary = grades
      .map((g) => `Sem ${g.semester}: ${g.gpa} GPA`)
      .join(", ");

    const attendanceSummary = attendance
      .map((a) => {
        const pct = ((a.attended_lectures / a.total_lectures) * 100).toFixed(1);
        const needed = Math.max(0, Math.ceil(a.total_lectures * 0.75) - a.attended_lectures);
        return `${a.subject}: ${a.attended_lectures}/${a.total_lectures} (${pct}%)${needed > 0 ? ` — needs ${needed} more` : " ✅"}`;
      })
      .join("\n");

    const studentContext = `
CURRENT STUDENT DATA (pulled live from database):
- Name: ${student.name}
- Student ID: ${student.student_id}
- Program: ${student.program}
- Current Semester: ${student.semester}
- Batch: ${student.batch}

GRADES:
${gradesSummary}

ATTENDANCE:
${attendanceSummary}
    `;

    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[now.getDay()];
    const currentTime = now.toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
      hour12: true, timeZone: "Asia/Kolkata",
    });

    const reply = await generateResponse(
      message.trim(),
      currentDay,
      currentTime,
      studentContext
    );

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;