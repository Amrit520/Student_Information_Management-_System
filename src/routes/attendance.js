const express = require("express");
const { pool } = require("../../db");

const router = express.Router();

// CREATE attendance
router.post("/", async (req, res) => {
  const { AttendanceID, StudentID, CourseID, Percentage } = req.body;

  if (!Number.isInteger(Number(AttendanceID))) return res.status(400).json({ error: "AttendanceID must be an integer" });
  if (!Number.isInteger(Number(StudentID))) return res.status(400).json({ error: "StudentID must be an integer" });
  if (!Number.isInteger(Number(CourseID))) return res.status(400).json({ error: "CourseID must be an integer" });

  const p = Number(Percentage);
  if (Number.isNaN(p) || p < 0 || p > 100) return res.status(400).json({ error: "Percentage must be between 0 and 100" });

  try {
    await pool.execute(
      "INSERT INTO ATTENDANCE (AttendanceID, StudentID, CourseID, Percentage) VALUES (?, ?, ?, ?)",
      [Number(AttendanceID), Number(StudentID), Number(CourseID), p]
    );
    res.json({ message: "Attendance added" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ attendance
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.AttendanceID, a.StudentID, s.Name AS StudentName,
              a.CourseID, c.CourseName, a.Percentage
       FROM ATTENDANCE a
       JOIN STUDENT s ON s.StudentID = a.StudentID
       JOIN COURSE c ON c.CourseID = a.CourseID
       ORDER BY a.AttendanceID`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE attendance percentage
router.put("/:AttendanceID", async (req, res) => {
  const attendanceId = Number(req.params.AttendanceID);
  const p = Number(req.body.Percentage);

  if (!Number.isInteger(attendanceId)) return res.status(400).json({ error: "AttendanceID must be an integer" });
  if (Number.isNaN(p) || p < 0 || p > 100) return res.status(400).json({ error: "Percentage must be between 0 and 100" });

  try {
    const [result] = await pool.execute("UPDATE ATTENDANCE SET Percentage=? WHERE AttendanceID=?", [p, attendanceId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Attendance not found" });
    res.json({ message: "Attendance updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE attendance
router.delete("/:AttendanceID", async (req, res) => {
  const attendanceId = Number(req.params.AttendanceID);
  if (!Number.isInteger(attendanceId)) return res.status(400).json({ error: "AttendanceID must be an integer" });

  try {
    const [result] = await pool.execute("DELETE FROM ATTENDANCE WHERE AttendanceID=?", [attendanceId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Attendance not found" });
    res.json({ message: "Attendance deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

