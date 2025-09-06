import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const { Pool } = pkg;
const app = express();

// __dirname для ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Підключення до PostgreSQL через internal URL Render
const pool = new Pool({
  connectionString: "postgresql://dbflower_user:n7XnpUufCGUHQCHngxQdT6h20Jh8gIuz@dpg-d2tfjeur433s73dcfok0-a/dbflower",
  // SSL не потрібен для internal URL
});

// Middleware
app.use(cors());
app.use(express.json());

// Отримати магазини
app.get("/api/flowershop", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM flowershop ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching shops:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Отримати квіти
app.get("/api/flowers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM flowerslist ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching flowers:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Отримати всі замовлення
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Створити нове замовлення
app.post("/api/orders", async (req, res) => {
  const { flowers, price, address, date, customername, email, phone } = req.body;
  console.log("Received order:", req.body);

  try {
    const result = await pool.query(
      `INSERT INTO orders 
        (flowers, price, address, date, customername, email, phone) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [flowers, price, address, date, customername, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: err.message });
  }
});

// Роздача React фронтенду
app.use(express.static(path.join(__dirname, "build")));

// Catch-all для React SPA
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Старт сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
