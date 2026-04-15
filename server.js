const path = require("path");
const express = require("express");
const { pingDb } = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend (vanilla HTML/CSS/JS)
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/departments", require("./src/routes/departments"));
app.use("/api/students", require("./src/routes/students"));
app.use("/api/faculty", require("./src/routes/faculty"));
app.use("/api/courses", require("./src/routes/courses"));
app.use("/api/resources", require("./src/routes/resources"));
app.use("/api/enrollments", require("./src/routes/enrollments"));
app.use("/api/attendance", require("./src/routes/attendance"));

app.get("/api/health", async (req, res) => {
  try {
    await pingDb();
    res.json({ ok: true, db: "connected" });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Open the dashboard in your browser.");
});

