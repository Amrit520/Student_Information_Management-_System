const express = require("express");
const { pool } = require("../../db");
const { isIntInRange, requireString } = require("../utils/validate");

const router = express.Router();

// CREATE course
router.post("/", async (req, res) => {
  const { CourseID, CourseName, Credits, FacultyID } = req.body;

  if (!Number.isInteger(Number(CourseID))) return res.status(400).json({ error: "CourseID must be an integer" });
  const err1 = requireString(String(CourseName ?? ""), "CourseName", 120);
  const creditsOk = isIntInRange(Credits, 1, 6);
  if (err1) return res.status(400).json({ error: err1 });
  if (!creditsOk) return res.status(400).json({ error: "Credits must be an integer between 1 and 6" });
  if (FacultyID !== undefined && FacultyID !== null && FacultyID !== "" && !Number.isInteger(Number(FacultyID))) {
    return res.status(400).json({ error: "FacultyID must be an integer (or empty)" });
  }

  try {
    await pool.execute(
      "INSERT INTO COURSE (CourseID, CourseName, Credits, FacultyID) VALUES (?, ?, ?, ?)",
      [
        Number(CourseID),
        String(CourseName).trim(),
        Number(Credits),
        FacultyID === undefined || FacultyID === null || FacultyID === "" ? null : Number(FacultyID)
      ]
    );
    res.json({ message: "Course added" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ courses
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT c.CourseID, c.CourseName, c.Credits, c.FacultyID, f.Name AS FacultyName
       FROM COURSE c
       LEFT JOIN FACULTY f ON f.FacultyID = c.FacultyID
       ORDER BY c.CourseID`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ASSIGN faculty to course (simple module requirement)
router.put("/:CourseID/assign-faculty", async (req, res) => {
  const courseId = Number(req.params.CourseID);
  const { FacultyID } = req.body;

  if (!Number.isInteger(courseId)) return res.status(400).json({ error: "CourseID must be an integer" });
  if (!Number.isInteger(Number(FacultyID))) return res.status(400).json({ error: "FacultyID must be an integer" });

  try {
    const [result] = await pool.execute("UPDATE COURSE SET FacultyID=? WHERE CourseID=?", [
      Number(FacultyID),
      courseId
    ]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Faculty assigned to course" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE course (by CourseID)
router.put("/:CourseID", async (req, res) => {
  const courseId = Number(req.params.CourseID);
  const { CourseName, Credits, FacultyID } = req.body;

  if (!Number.isInteger(courseId)) return res.status(400).json({ error: "CourseID must be an integer" });
  const err1 = requireString(String(CourseName ?? ""), "CourseName", 120);
  const creditsOk = isIntInRange(Credits, 1, 6);
  if (err1) return res.status(400).json({ error: err1 });
  if (!creditsOk) return res.status(400).json({ error: "Credits must be an integer between 1 and 6" });
  if (FacultyID !== undefined && FacultyID !== null && FacultyID !== "" && !Number.isInteger(Number(FacultyID))) {
    return res.status(400).json({ error: "FacultyID must be an integer (or empty)" });
  }

  try {
    const [result] = await pool.execute(
      "UPDATE COURSE SET CourseName=?, Credits=?, FacultyID=? WHERE CourseID=?",
      [
        String(CourseName).trim(),
        Number(Credits),
        FacultyID === undefined || FacultyID === null || FacultyID === "" ? null : Number(FacultyID),
        courseId
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Course updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE course
router.delete("/:CourseID", async (req, res) => {
  const courseId = Number(req.params.CourseID);
  if (!Number.isInteger(courseId)) return res.status(400).json({ error: "CourseID must be an integer" });

  try {
    const [result] = await pool.execute("DELETE FROM COURSE WHERE CourseID = ?", [courseId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

