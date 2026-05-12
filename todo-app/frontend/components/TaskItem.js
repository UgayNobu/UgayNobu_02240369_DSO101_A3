import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/tasks/${task.id}`, {
        completed: !task.completed,
      });
      onTaskUpdated(response.data);
    } catch (err) {
      setError("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      setError("Title cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.put(`${API_URL}/tasks/${task.id}`, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      });
      onTaskUpdated(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setError("");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/tasks/${task.id}`);
      onTaskDeleted(task.id);
    } catch (err) {
      setError("Failed to delete task.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      ...styles.card,
      borderLeft: `4px solid ${task.completed ? "#10b981" : "#4f46e5"}`,
      opacity: task.completed && !isEditing ? 0.75 : 1
    }}>
      {error && <p style={styles.error}>{error}</p>}
      {isEditing ? (
        <div style={styles.editMode}>
          <div style={styles.field}>
            <label style={styles.label}>Title *</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              maxLength={255}
              autoFocus
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
          <div style={styles.actions}>
            <button onClick={handleSaveEdit} disabled={loading} style={styles.saveBtn}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancelEdit} disabled={loading} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.viewMode}>
          <div style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={loading}
              style={styles.checkbox}
              id={`task-${task.id}`}
            />
            <label htmlFor={`task-${task.id}`} style={styles.checkboxLabel}>
              <span style={{
                ...styles.title,
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#6b7280" : "#111827"
              }}>
                {task.title}
              </span>
              {task.completed && <span style={styles.completedBadge}>Completed</span>}
            </label>
          </div>
          {task.description && <p style={styles.description}>{task.description}</p>}
          <div style={styles.metaRow}>
            <span style={styles.meta}>
              Added {new Date(task.created_at).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric"
              })}
            </span>
            <div style={styles.actions}>
              <button onClick={() => setIsEditing(true)} disabled={loading} style={styles.editBtn}>
                Edit
              </button>
              <button onClick={handleDelete} disabled={loading} style={styles.deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { background:"#ffffff", borderRadius:"10px", padding:"18px 20px", boxShadow:"0 1px 3px rgba(0,0,0,0.07)" },
  viewMode: { display:"flex", flexDirection:"column", gap:"10px" },
  editMode: { display:"flex", flexDirection:"column", gap:"12px" },
  checkboxRow: { display:"flex", alignItems:"center", gap:"10px" },
  checkbox: { width:"18px", height:"18px", cursor:"pointer", accentColor:"#4f46e5" },
  checkboxLabel: { display:"flex", alignItems:"center", gap:"10px", cursor:"pointer", flex:1 },
  title: { fontSize:"1rem", fontWeight:600, lineHeight:1.4 },
  completedBadge: { fontSize:"0.7rem", fontWeight:700, background:"#d1fae5", color:"#065f46", borderRadius:"99px", padding:"2px 8px" },
  description: { fontSize:"0.875rem", color:"#6b7280", paddingLeft:"28px", lineHeight:1.6 },
  metaRow: { display:"flex", justifyContent:"space-between", alignItems:"center", paddingLeft:"28px" },
  meta: { fontSize:"0.75rem", color:"#9ca3af" },
  actions: { display:"flex", gap:"8px" },
  editBtn: { background:"#f3f4f6", color:"#374151", padding:"6px 12px" },
  deleteBtn: { background:"#fef2f2", color:"#dc2626", padding:"6px 12px" },
  saveBtn: { background:"#10b981", color:"#fff", padding:"7px 16px" },
  cancelBtn: { background:"#f3f4f6", color:"#374151", padding:"7px 14px" },
  field: { display:"flex", flexDirection:"column", gap:"5px" },
  label: { fontSize:"0.8rem", fontWeight:600, color:"#374151" },
  error: { color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"6px", padding:"8px 12px", fontSize:"0.8rem", marginBottom:"8px" },
};