const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const port = 3000;

const mysqlConfig = {
  host: "db",
  user: "root",
  password: "somewordpress",
  database: "posts",
};

let connection;
(async () => {
  connection = await mysql.createConnection(mysqlConfig);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
})();

app.use(express.json());

app.get("/posts", async (req, res) => {
  const [rows] = await connection.query("SELECT * FROM posts");
  res.json(rows);
});

app.post("/posts", async (req, res) => {
  const { title, content } = req.body;
  const [result] = await connection.query(
    "INSERT INTO posts (title, content) VALUES (?, ?)",
    [title, content]
  );
  res.status(201).json({ id: result.insertId, title, content });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
