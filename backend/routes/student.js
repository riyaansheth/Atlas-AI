const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
        req.student = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

router.get("/me", authMiddleware, async (req, res) => {
    const { student_id } = req.student;

    try {
        const [student] = await db.query(
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

        res.json({
            ...student[0],
            grades,
            attendance,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = { router, authMiddleware };