const TaskCard = ({ task }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "green";
      case "pending":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <div className="task-card">
      <h3>{task.title}</h3>

      <p>
        Status:{" "}
        <span style={{ color: getStatusColor(task.status) }}>
          {task.status}
        </span>
      </p>

      <p>Priority: {task.priority}</p>
      <p>Due: {task.dueDate}</p>
    </div>
  );
};

export default TaskCard;