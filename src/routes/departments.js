const express = require("express");
const { pool } = require("../../db");
const { requireString } = require("../utils/validate");

const router = express.Router();

// CREATE department
router.post("/", async (req, res) => {
  const { DeptCode, DeptName, DeptHead } = req.body;

  const err1 = requireString(String(DeptCode ?? ""), "DeptCode", 10);
  const err2 = requireString(String(DeptName ?? ""), "DeptName", 100);
  const err3 = requireString(String(DeptHead ?? ""), "DeptHead", 100);
  const err = err1 || err2 || err3;
  if (err) return res.status(400).json({ error: err });

  try {
    await pool.execute(
      "INSERT INTO DEPARTMENT (DeptCode, DeptName, DeptHead) VALUES (?, ?, ?)",
      [String(DeptCode).trim(), String(DeptName).trim(), String(DeptHead).trim()]
    );
    res.json({ message: "Department added" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ departments
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT DeptCode, DeptName, DeptHead FROM DEPARTMENT ORDER BY DeptCode"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE department (by DeptCode)
router.put("/:DeptCode", async (req, res) => {
  const deptCode = String(req.params.DeptCode ?? "").trim();
  const { DeptName, DeptHead } = req.body;

  const err1 = requireString(deptCode, "DeptCode", 10);
  const err2 = requireString(String(DeptName ?? ""), "DeptName", 100);
  const err3 = requireString(String(DeptHead ?? ""), "DeptHead", 100);
  const err = err1 || err2 || err3;
  if (err) return res.status(400).json({ error: err });

  try {
    const [result] = await pool.execute(
      "UPDATE DEPARTMENT SET DeptName = ?, DeptHead = ? WHERE DeptCode = ?",
      [String(DeptName).trim(), String(DeptHead).trim(), deptCode]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Department not found" });
    res.json({ message: "Department updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE department (by DeptCode)
router.delete("/:DeptCode", async (req, res) => {
  const deptCode = String(req.params.DeptCode ?? "").trim();
  const err = requireString(deptCode, "DeptCode", 10);
  if (err) return res.status(400).json({ error: err });

  try {
    const [result] = await pool.execute("DELETE FROM DEPARTMENT WHERE DeptCode = ?", [deptCode]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Department not found" });
    res.json({ message: "Department deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

