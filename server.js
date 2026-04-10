const PORT = process.env.PORT || 3000;
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();


app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./points.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS points (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      x INTEGER NOT NULL,
      y INTEGER NOT NULL
    )
  `);
});

// Save point
app.post("/points", (req, res) => {
  const { x, y } = req.body;
  db.run(
    "INSERT INTO points (x, y) VALUES (?, ?)",
    [x, y],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, x, y });
    }
  );
});

// Get all points
app.get("/points", (req, res) => {
  db.all("SELECT x, y FROM points", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});