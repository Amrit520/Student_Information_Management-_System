const express = require("express");
const { pool } = require("../../db");
const { isIntInRange, requireString, optionalString, requireEmail } = require("../utils/validate");

const router = express.Router();

// CREATE student
router.post("/", async (req, res) => {
  const { StudentID, Name, Email, Phone, Department, Semester } = req.body;

  if (!Number.isInteger(Number(StudentID))) return res.status(400).json({ error: "StudentID must be an integer" });
  const err1 = requireString(String(Name ?? ""), "Name", 100);
  const err2 = requireEmail(Email);
  const err3 = optionalString(Phone, "Phone", 20);
  const err4 = requireString(String(Department ?? ""), "Department", 10);
  const semOk = isIntInRange(Semester, 1, 8);
  const err = err1 || err2 || err3 || err4 || (!semOk ? "Semester must be an integer between 1 and 8" : null);
  if (err) return res.status(400).json({ error: err });

  try {
    await pool.execute(
      "INSERT INTO STUDENT (StudentID, Name, Email, Phone, Department, Semester) VALUES (?, ?, ?, ?, ?, ?)",
      [
        Number(StudentID),
        String(Name).trim(),
        String(Email).trim(),
        Phone === undefined || Phone === null ? null : String(Phone).trim(),
        String(Department).trim(),
        Number(Semester)
      ]
    );
    res.json({ message: "Student added" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ students
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT s.StudentID, s.Name, s.Email, s.Phone, s.Department, d.DeptName, s.Semester
       FROM STUDENT s
       JOIN DEPARTMENT d ON d.DeptCode = s.Department
       ORDER BY s.StudentID`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE student (by StudentID)
router.put("/:StudentID", async (req, res) => {
  const studentId = Number(req.params.StudentID);
  const { Name, Email, Phone, Department, Semester } = req.body;

  if (!Number.isInteger(studentId)) return res.status(400).json({ error: "StudentID must be an integer" });
  const err1 = requireString(String(Name ?? ""), "Name", 100);
  const err2 = requireEmail(Email);
  const err3 = optionalString(Phone, "Phone", 20);
  const err4 = requireString(String(Department ?? ""), "Department", 10);
  const semOk = isIntInRange(Semester, 1, 8);
  const err = err1 || err2 || err3 || err4 || (!semOk ? "Semester must be an integer between 1 and 8" : null);
  if (err) return res.status(400).json({ error: err });

  try {
    const [result] = await pool.execute(
      "UPDATE STUDENT SET Name=?, Email=?, Phone=?, Department=?, Semester=? WHERE StudentID=?",
      [
        String(Name).trim(),
        String(Email).trim(),
        Phone === undefined || Phone === null ? null : String(Phone).trim(),
        String(Department).trim(),
        Number(Semester),
        studentId
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE student (by StudentID)
router.delete("/:StudentID", async (req, res) => {
  const studentId = Number(req.params.StudentID);
  if (!Number.isInteger(studentId)) return res.status(400).json({ error: "StudentID must be an integer" });

  try {
    const [result] = await pool.execute("DELETE FROM STUDENT WHERE StudentID = ?", [studentId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

