import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted }) {
  if (tasks.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={styles.emptyIcon}>📋</span>
        <p style={styles.emptyText}>No tasks yet. Add your first task above!</p>
      </div>
    );
  }

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div>
      {pending.length > 0 && (
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>
            Pending <span style={styles.badge}>{pending.length}</span>
          </h3>
          <div style={styles.list}>
            {pending.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskUpdated={onTaskUpdated}
                onTaskDeleted={onTaskDeleted}
              />
            ))}
          </div>
        </section>
      )}
      {completed.length > 0 && (
        <section style={styles.section}>
          <h3 style={{...styles.sectionTitle, color:"#6b7280"}}>
            Completed <span style={{...styles.badge, background:"#d1fae5", color:"#065f46"}}>
              {completed.length}
            </span>
          </h3>
          <div style={styles.list}>
            {completed.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskUpdated={onTaskUpdated}
                onTaskDeleted={onTaskDeleted}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const styles = {
  empty: { display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 20px", background:"#ffffff", borderRadius:"12px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", gap:"12px" },
  emptyIcon: { fontSize:"2.5rem" },
  emptyText: { color:"#9ca3af", fontSize:"1rem" },
  section: { marginBottom:"28px" },
  sectionTitle: { fontSize:"0.85rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color:"#374151", marginBottom:"12px", display:"flex", alignItems:"center", gap:"8px" },
  badge: { background:"#ede9fe", color:"#5b21b6", borderRadius:"99px", padding:"2px 8px", fontSize:"0.75rem", fontWeight:700, textTransform:"none", letterSpacing:0 },
  list: { display:"flex", flexDirection:"column", gap:"10px" },
};