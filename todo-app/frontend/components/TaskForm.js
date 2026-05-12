import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        title: title.trim(),
        description: description.trim() || null,
      });
      onTaskAdded(response.data);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add task. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Add New Task</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="title">
            Title <span style={{color:"#ef4444"}}>*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="description">
            Description <span style={{color:"#9ca3af", fontWeight:400}}>(optional)</span>
          </label>
          <textarea
            id="description"
            placeholder="Add more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? "Adding..." : "+ Add Task"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: { background:"#ffffff", borderRadius:"12px", padding:"24px", boxShadow:"0 1px 4px rgba(0,0,0,0.08)", marginBottom:"28px" },
  heading: { fontSize:"1.1rem", fontWeight:700, marginBottom:"18px", color:"#111827" },
  form: { display:"flex", flexDirection:"column", gap:"14px" },
  field: { display:"flex", flexDirection:"column", gap:"6px" },
  label: { fontSize:"0.85rem", fontWeight:600, color:"#374151" },
  submitBtn: { background:"#4f46e5", color:"#fff", padding:"11px 20px", fontSize:"0.95rem", borderRadius:"8px", alignSelf:"flex-start", marginTop:"4px" },
  error: { color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"6px", padding:"10px 14px", fontSize:"0.875rem", marginBottom:"12px" },
};