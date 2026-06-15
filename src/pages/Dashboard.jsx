import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  // GET TASKS
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {
      toast.error("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  // CREATE / UPDATE TASK
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const taskData = {
      title,
      description,
      priority,
      dueDate,
    };

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, taskData);

        setTasks(
          tasks.map((task) =>
            task._id === editingId ? { ...task, ...taskData } : task
          )
        );

        toast.success("Task Updated Successfully");
        setEditingId(null);
      } else {
        const res = await api.post("/tasks", taskData);

        setTasks([...tasks, res.data]);

        toast.success("Task Added Successfully");
      }

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch {
      toast.error("Operation Failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(task.dueDate);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${id}`);

      setTasks(tasks.filter((task) => task._id !== id));

      toast.success("Task Deleted");
    } catch {
      toast.error("Delete Failed");
    }
  };

  const handleStatusToggle = async (task) => {
    const newStatus =
      task.status === "completed" ? "pending" : "completed";

    try {
      await api.put(`/tasks/${task._id}`, {
        ...task,
        status: newStatus,
      });

      setTasks(
        tasks.map((t) =>
          t._id === task._id ? { ...t, status: newStatus } : t
        )
      );

      toast.success(`Task marked ${newStatus}`);
    } catch {
      toast.error("Status Update Failed");
    }
  };

  const total = tasks.length;
  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pending = total - completed;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchesFilter = true;

    if (filter === "pending") {
      matchesFilter = task.status === "pending";
    } else if (filter === "completed") {
      matchesFilter = task.status === "completed";
    } else if (filter === "high") {
      matchesFilter = task.priority === "high";
    }

    return matchesSearch && matchesFilter;
  });

  if (loading) return <h2>Loading...</h2>;

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <h1>Dashboard</h1>

        <div className="card-container">
          <div className="card">
            <h3>Total Tasks</h3>
            <p>{total}</p>
          </div>

          <div className="card">
            <h3>Completed</h3>
            <p>{completed}</p>
          </div>

          <div className="card">
            <h3>Pending</h3>
            <p>{pending}</p>
          </div>
        </div>

        <h2>{editingId ? "Edit Task" : "Add Task"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <button type="submit" disabled={btnLoading}>
            {btnLoading
              ? editingId
                ? "Updating..."
                : "Adding..."
              : editingId
              ? "Update Task"
              : "Add Task"}
          </button>
        </form>

        <h2>Task List</h2>

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filter-buttons">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("high")}>
            High Priority
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <p>
                <strong>Priority:</strong>{" "}
                <span className={`priority-${task.priority}`}>
                  {task.priority.toUpperCase()}
                </span>
              </p>

              <p>
                <strong>Status:</strong> {task.status}
              </p>

              <p>
                <strong>Due Date:</strong> {task.dueDate}
              </p>

              <div className="task-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>

                <button
                  className="status-btn"
                  onClick={() => handleStatusToggle(task)}
                >
                  {task.status === "completed"
                    ? "Mark Pending"
                    : "Mark Complete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Dashboard;