import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
  });

  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data || []);
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (editId) {
        await api.put(`/tasks/${editId}`, form);
        toast.success("Task Updated Successfully");
      } else {
        await api.post("/tasks", form);
        toast.success("Task Added Successfully");
      }

      setForm({
        title: "",
        description: "",
        priority: "low",
        dueDate: "",
      });

      setEditId(null);
      fetchTasks();
    } catch {
      toast.error("Operation Failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);

      setTasks((prev) => prev.filter((t) => t._id !== id));

      toast.success("Task Deleted");
    } catch {
      toast.error("Delete Failed");
    }
  };

  const startEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate?.split("T")[0] || "",
    });

    setEditId(task._id);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      default:
        return "#22c55e";
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      <h1>Tasks CRUD</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            background: loading ? "#94a3b8" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? editId
              ? "Updating..."
              : "Adding..."
            : editId
            ? "Update Task"
            : "Add Task"}
        </button>
      </form>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                background: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <span
                style={{
                  background: getPriorityColor(task.priority),
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                }}
              >
                {task.priority.toUpperCase()}
              </span>

              <p style={{ marginTop: "10px" }}>
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "N/A"}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button onClick={() => startEdit(task)}>
                  Edit
                </button>

                <button onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}