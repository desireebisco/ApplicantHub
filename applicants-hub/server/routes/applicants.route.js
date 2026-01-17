import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Create
router.post("/", async (req, res) => {
  console.log("Received body:", req.body);  // DEBUG LINE
  try {
    const { name, email, position } = req.body;

    const [result] = await pool.query(
      "INSERT INTO applicants (name, email, position) VALUES (?, ?, ?)",
      [name, email, position]
    );

    res.json({ message: "Applicant added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read All
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM applicants");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read One
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM applicants WHERE id = ?",
      [req.params.id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { name, email, position } = req.body;

    await pool.query(
      "UPDATE applicants SET name=?, email=?, position=? WHERE id=?",
      [name, email, position, req.params.id]
    );

    res.json({ message: "Applicant updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM applicants WHERE id=?", [req.params.id]);
    res.json({ message: "Applicant deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
