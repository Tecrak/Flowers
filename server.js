import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const app = express();

// Встановлюємо __dirname для ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Підключення до PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Middleware для JSON
app.use(express.json());

// API: отримати список квітів
app.get("/api/flowers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM flowers");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// API: створити нове замовлення
app.post("/api/orders", async (req, res) => {
  const { user_id, flower_id, quantity } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO orders (user_id, flower_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [user_id, flower_id, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Роздача React фронтенду
app.use(express.static(path.join(__dirname, "build")));

// Catch-all для React SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Старт сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
