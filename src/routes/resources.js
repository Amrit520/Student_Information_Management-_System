const express = require("express");
const { pool } = require("../../db");
const { requireString } = require("../utils/validate");

const router = express.Router();

// CREATE resource
router.post("/", async (req, res) => {
  const { ResourceID, ResourceType, Location, Availability, Capacity } = req.body;

  if (!Number.isInteger(Number(ResourceID))) return res.status(400).json({ error: "ResourceID must be an integer" });
  const err1 = requireString(String(ResourceType ?? ""), "ResourceType", 60);
  const err2 = requireString(String(Location ?? ""), "Location", 120);
  const availability = String(Availability ?? "").trim();
  if (!["AVAILABLE", "NOT_AVAILABLE"].includes(availability)) {
    return res.status(400).json({ error: "Availability must be AVAILABLE or NOT_AVAILABLE" });
  }
  if (!Number.isInteger(Number(Capacity)) || Number(Capacity) < 0) {
    return res.status(400).json({ error: "Capacity must be a non-negative integer" });
  }
  const err = err1 || err2;
  if (err) return res.status(400).json({ error: err });

  try {
    await pool.execute(
      "INSERT INTO RESOURCE (ResourceID, ResourceType, Location, Availability, Capacity) VALUES (?, ?, ?, ?, ?)",
      [Number(ResourceID), String(ResourceType).trim(), String(Location).trim(), availability, Number(Capacity)]
    );
    res.json({ message: "Resource added" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ resources
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT ResourceID, ResourceType, Location, Availability, Capacity FROM RESOURCE ORDER BY ResourceID"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE resource
router.put("/:ResourceID", async (req, res) => {
  const resourceId = Number(req.params.ResourceID);
  const { ResourceType, Location, Availability, Capacity } = req.body;

  if (!Number.isInteger(resourceId)) return res.status(400).json({ error: "ResourceID must be an integer" });
  const err1 = requireString(String(ResourceType ?? ""), "ResourceType", 60);
  const err2 = requireString(String(Location ?? ""), "Location", 120);
  const availability = String(Availability ?? "").trim();
  if (!["AVAILABLE", "NOT_AVAILABLE"].includes(availability)) {
    return res.status(400).json({ error: "Availability must be AVAILABLE or NOT_AVAILABLE" });
  }
  if (!Number.isInteger(Number(Capacity)) || Number(Capacity) < 0) {
    return res.status(400).json({ error: "Capacity must be a non-negative integer" });
  }
  const err = err1 || err2;
  if (err) return res.status(400).json({ error: err });

  try {
    const [result] = await pool.execute(
      "UPDATE RESOURCE SET ResourceType=?, Location=?, Availability=?, Capacity=? WHERE ResourceID=?",
      [String(ResourceType).trim(), String(Location).trim(), availability, Number(Capacity), resourceId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Resource not found" });
    res.json({ message: "Resource updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE resource
router.delete("/:ResourceID", async (req, res) => {
  const resourceId = Number(req.params.ResourceID);
  if (!Number.isInteger(resourceId)) return res.status(400).json({ error: "ResourceID must be an integer" });

  try {
    const [result] = await pool.execute("DELETE FROM RESOURCE WHERE ResourceID = ?", [resourceId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Resource not found" });
    res.json({ message: "Resource deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

