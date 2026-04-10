const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// health check
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /points
app.get('/points', (req, res) => {
  db.all("SELECT * FROM points", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// 👉 POST /points
app.post('/points', (req, res) => {
  const { x, y } = req.body;

  db.run(
    "INSERT INTO points(x, y) VALUES(?, ?)",
    [x, y],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID, x, y });
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});