const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

router.post("/login", async (req, res) => {
    const { student_id, password } = req.body;

    try {
        const [rows] = await db.query(
            "SELECT * FROM students WHERE student_id = ?",
            [student_id]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "Student ID not found" });
        }

        const student = rows[0];
        const validPassword = await bcrypt.compare(password, student.password);

        if (!validPassword) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        const token = jwt.sign(
            { student_id: student.student_id, name: student.name },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            name: student.name,
            student_id: student.student_id,
            program: student.program,
            semester: student.semester,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;