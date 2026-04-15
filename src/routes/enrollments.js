const express = require("express");
const { pool } = require("../../db");
const { isIntInRange } = require("../utils/validate");

const router = express.Router();

// ENROLL student in course (CREATE enrollment)
router.post("/", async (req, res) => {
  const { EnrollmentID, StudentID, CourseID, Semester, Grade } = req.body;

  if (!Number.isInteger(Number(EnrollmentID))) return res.status(400).json({ error: "EnrollmentID must be an integer" });
  if (!Number.isInteger(Number(StudentID))) return res.status(400).json({ error: "StudentID must be an integer" });
  if (!Number.isInteger(Number(CourseID))) return res.status(400).json({ error: "CourseID must be an integer" });
  if (!isIntInRange(Semester, 1, 8)) return res.status(400).json({ error: "Semester must be an integer between 1 and 8" });
  if (Grade !== undefined && Grade !== null && String(Grade).length > 5) return res.status(400).json({ error: "Grade max length is 5" });

  try {
    await pool.execute(
      "INSERT INTO ENROLLMENT (EnrollmentID, StudentID, CourseID, Semester, Grade) VALUES (?, ?, ?, ?, ?)",
      [
        Number(EnrollmentID),
        Number(StudentID),
        Number(CourseID),
        Number(Semester),
        Grade === undefined || Grade === null || Grade === "" ? null : String(Grade).trim()
      ]
    );
    res.json({ message: "Student enrolled" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ enrollments
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT e.EnrollmentID, e.StudentID, s.Name AS StudentName,
              e.CourseID, c.CourseName, e.Semester, e.Grade
       FROM ENROLLMENT e
       JOIN STUDENT s ON s.StudentID = e.StudentID
       JOIN COURSE c ON c.CourseID = e.CourseID
       ORDER BY e.EnrollmentID`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE enrollment (Grade/Semester)
router.put("/:EnrollmentID", async (req, res) => {
  const enrollmentId = Number(req.params.EnrollmentID);
  const { Semester, Grade } = req.body;

  if (!Number.isInteger(enrollmentId)) return res.status(400).json({ error: "EnrollmentID must be an integer" });
  if (!isIntInRange(Semester, 1, 8)) return res.status(400).json({ error: "Semester must be an integer between 1 and 8" });
  if (Grade !== undefined && Grade !== null && String(Grade).length > 5) return res.status(400).json({ error: "Grade max length is 5" });

  try {
    const [result] = await pool.execute("UPDATE ENROLLMENT SET Semester=?, Grade=? WHERE EnrollmentID=?", [
      Number(Semester),
      Grade === undefined || Grade === null || Grade === "" ? null : String(Grade).trim(),
      enrollmentId
    ]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Enrollment not found" });
    res.json({ message: "Enrollment updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE enrollment
router.delete("/:EnrollmentID", async (req, res) => {
  const enrollmentId = Number(req.params.EnrollmentID);
  if (!Number.isInteger(enrollmentId)) return res.status(400).json({ error: "EnrollmentID must be an integer" });

  try {
    const [result] = await pool.execute("DELETE FROM ENROLLMENT WHERE EnrollmentID=?", [enrollmentId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Enrollment not found" });
    res.json({ message: "Enrollment deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

