import { useState, useEffect } from "react";

export default function TaskModal({ onClose, onSave, editTask }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
  });

  useEffect(() => {
    if (editTask) setForm(editTask);
  }, [editTask]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{editTask ? "Edit Task" : "Add Task"}</h2>

        <form onSubmit={handleSubmit}>
          <input name="title" onChange={handleChange} value={form.title} placeholder="Title" />
          <input name="description" onChange={handleChange} value={form.description} placeholder="Description" />

          <select name="priority" onChange={handleChange} value={form.priority}>
            <option>low</option>
            <option>medium</option>
            <option>high</option>
          </select>

          <input type="date" name="dueDate" onChange={handleChange} value={form.dueDate} />

          <button type="submit">
            {editTask ? "Update" : "Create"}
          </button>

          <button type="button" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
}