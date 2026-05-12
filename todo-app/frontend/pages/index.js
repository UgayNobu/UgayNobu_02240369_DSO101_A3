import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`);
        setTasks(response.data);
      } catch (err) {
        setFetchError("Could not connect to the backend. Make sure the server is running on port 5000.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskAdded = (newTask) => setTasks((prev) => [newTask, ...prev]);
  const handleTaskUpdated = (updatedTask) => setTasks((prev) => prev.map((t) => t.id === updatedTask.id ? updatedTask : t));
  const handleTaskDeleted = (deletedId) => setTasks((prev) => prev.filter((t) => t.id !== deletedId));

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <>
      <Head>
        <title>To-Do List App</title>
        <meta name="description" content="Full-stack to-do list app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={styles.main}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div>
              <h1 style={styles.title}>My To-Do List</h1>
              <p style={styles.subtitle}>Stay organized. Get things done.</p>
            </div>
            {!loading && !fetchError && (
              <div style={styles.stats}>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>{totalCount}</span>
                  <span style={styles.statLabel}>Total</span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.statItem}>
                  <span style={{...styles.statNumber, color:"#10b981"}}>{completedCount}</span>
                  <span style={styles.statLabel}>Done</span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.statItem}>
                  <span style={{...styles.statNumber, color:"#4f46e5"}}>{totalCount - completedCount}</span>
                  <span style={styles.statLabel}>Pending</span>
                </div>
              </div>
            )}
          </header>
          <TaskForm onTaskAdded={handleTaskAdded} />
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner} />
              <p>Loading tasks...</p>
            </div>
          ) : fetchError ? (
            <div style={styles.errorBox}>
              <strong>Connection Error</strong>
              <p style={{marginTop:"6px"}}>{fetchError}</p>
            </div>
          ) : (
            <TaskList tasks={tasks} onTaskUpdated={handleTaskUpdated} onTaskDeleted={handleTaskDeleted} />
          )}
        </div>
      </main>
      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

const styles = {
  main: { minHeight:"100vh", padding:"40px 16px 80px", background:"linear-gradient(135deg, #f0f2f5 0%, #e8ecf4 100%)" },
  container: { maxWidth:"680px", margin:"0 auto" },
  header: { marginBottom:"28px", display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"16px" },
  title: { fontSize:"1.9rem", fontWeight:800, color:"#111827", letterSpacing:"-0.5px" },
  subtitle: { fontSize:"0.9rem", color:"#6b7280", marginTop:"4px" },
  stats: { display:"flex", alignItems:"center", gap:"16px", background:"#fff", borderRadius:"10px", padding:"12px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.07)" },
  statItem: { display:"flex", flexDirection:"column", alignItems:"center" },
  statNumber: { fontSize:"1.3rem", fontWeight:800, color:"#111827", lineHeight:1 },
  statLabel: { fontSize:"0.68rem", color:"#9ca3af", fontWeight:600, textTransform:"uppercase", marginTop:"2px" },
  statDivider: { width:"1px", height:"28px", background:"#e5e7eb" },
  loading: { display:"flex", flexDirection:"column", alignItems:"center", gap:"16px", padding:"48px", color:"#6b7280" },
  spinner: { width:"36px", height:"36px", border:"3px solid #e5e7eb", borderTopColor:"#4f46e5", borderRadius:"50%", animation:"spin 0.8s linear infinite" },
  errorBox: { background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", padding:"20px", color:"#b91c1c", fontSize:"0.9rem" },
};