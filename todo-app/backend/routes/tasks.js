const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /tasks
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST /tasks
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO tasks (title, description, completed) VALUES (?, ?, false)",
      [title.trim(), description ? description.trim() : null]
    );
    const [newTask] = await db.query("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(newTask[0]);
  } catch (err) {
    console.error("POST /tasks error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT /tasks/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ error: "Title cannot be empty" });
  }
  try {
    const [existing] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    const updatedTitle = title !== undefined ? title.trim() : existing[0].title;
    const updatedDescription = description !== undefined ? description.trim() : existing[0].description;
    const updatedCompleted = completed !== undefined ? completed : existing[0].completed;

    await db.query(
      "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?",
      [updatedTitle, updatedDescription, updatedCompleted, id]
    );
    const [updatedTask] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
    res.json(updatedTask[0]);
  } catch (err) {
    console.error("PUT /tasks/:id error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /tasks/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    await db.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.json({ message: "Task deleted successfully", id: parseInt(id) });
  } catch (err) {
    console.error("DELETE /tasks/:id error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;