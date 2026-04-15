const mysql = require("mysql2/promise");

// Beginner-friendly config: edit these values for your MySQL setup.
// Keep password empty ("") if your MySQL root has no password.
const DB_CONFIG = {
  host: "localhost",
  user: "dbms",
  password: "Amrit@123",
  database: "smart_college_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(DB_CONFIG);

async function pingDb() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}

module.exports = { pool, pingDb };

