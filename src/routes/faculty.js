const express = require("express");
const { pool } = require("../../db");
const { requireString } = require("../utils/validate");

const router = express.Router();

// CREATE faculty
router.post("/", async (req, res) => {
  const { FacultyID, Name, Department, Designation } = req.body;

  if (!Number.isInteger(Number(FacultyID))) return res.status(400).json({ error: "FacultyID must be an integer" });
  const err1 = requireString(String(Name ?? ""), "Name", 100);
  const err2 = requireString(String(Department ?? ""), "Department", 10);
  const err3 = requireString(String(Designation ?? ""), "Designation", 60);
  const err = err1 || err2 || err3;
  if (err) return res.status(400).json({ error: err });

  try {
    await pool.execute(
      "INSERT INTO FACULTY (FacultyID, Name, Department, Designation) VALUES (?, ?, ?, ?)",
      [Number(FacultyID), String(Name).trim(), String(Department).trim(), String(Designation).trim()]
    );
    res.json({ message: "Faculty added" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ faculty
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT f.FacultyID, f.Name, f.Department, d.DeptName, f.Designation
       FROM FACULTY f
       JOIN DEPARTMENT d ON d.DeptCode = f.Department
       ORDER BY f.FacultyID`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE faculty
router.put("/:FacultyID", async (req, res) => {
  const facultyId = Number(req.params.FacultyID);
  const { Name, Department, Designation } = req.body;

  if (!Number.isInteger(facultyId)) return res.status(400).json({ error: "FacultyID must be an integer" });
  const err1 = requireString(String(Name ?? ""), "Name", 100);
  const err2 = requireString(String(Department ?? ""), "Department", 10);
  const err3 = requireString(String(Designation ?? ""), "Designation", 60);
  const err = err1 || err2 || err3;
  if (err) return res.status(400).json({ error: err });

  try {
    const [result] = await pool.execute(
      "UPDATE FACULTY SET Name=?, Department=?, Designation=? WHERE FacultyID=?",
      [String(Name).trim(), String(Department).trim(), String(Designation).trim(), facultyId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Faculty not found" });
    res.json({ message: "Faculty updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE faculty
router.delete("/:FacultyID", async (req, res) => {
  const facultyId = Number(req.params.FacultyID);
  if (!Number.isInteger(facultyId)) return res.status(400).json({ error: "FacultyID must be an integer" });

  try {
    const [result] = await pool.execute("DELETE FROM FACULTY WHERE FacultyID = ?", [facultyId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Faculty not found" });
    res.json({ message: "Faculty deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

