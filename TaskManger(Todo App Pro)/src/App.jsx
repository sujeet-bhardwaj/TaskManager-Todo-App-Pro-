import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {

const [tasks, setTasks] = useState(() => {
  const storedTasks = localStorage.getItem("tasks");
  
  return storedTasks ? JSON.parse(storedTasks):[];
});
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
    const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : false; 
  });
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef(null);
  
  function addTask() {
    const taskText = inputRef.current.value.trim();
    if (!taskText) return;
    const newTask = {
      id: Date.now(),
      task: taskText,
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    inputRef.current.value = "";
  }

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");     
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);  
      setTasks(parsedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
   localStorage.setItem("theme", JSON.stringify(isDark));
  }, [tasks,isDark]);

  function deleteTask(id) {
    setTasks(tasks.filter((item) => item.id != id));
  }
  function showCompleted() {
    setActiveFilter("completed");
  }
  function showPending() {
    setActiveFilter("pending");
  }
  function showAll() {
    setActiveFilter("all");
  }
  function toggleComplete(id) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updatedTasks);
  }
  const handleEdit = (task) => {
    setEditId(task.id);
    setEditText(task.task);
  };
  function handleSave() {
    if (!editText.trim()) return;
    const updatedTasks = tasks.map((task) =>
      task.id === editId ? { ...task, task: editText } : task,
    );
    setTasks(updatedTasks);
    setEditId(null);
    setEditText("");
  }
  function searchHandle(e) {
    setSearchText(e.target.value);
  }
 
  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.task
      .toLowerCase()
      .includes(searchText.toLowerCase());
    if (activeFilter === "completed") {
      return matchesSearch && task.completed;
    }

    if (activeFilter === "pending") {
      return matchesSearch && !task.completed;
    }

    return matchesSearch;
  });

  return (
    <div className={ isDark?`app bodyDark`:`app`  }>
      <div
        className={
          isDark ? "todo-containerDark":"todo-container" 
        }
      >
        <div className="heading">
          <h1 className="title">Todo App Pro</h1>
          <button
  className={isDark ? "theme-btnDark" : "theme-btn"}
  onClick={toggleTheme}
>
  {isDark ? "🔆 light Mode" : "🌙 dark Mode"}
</button>

        </div>
        <div className="task-form">
          <input
            type="text"
            placeholder="Enter a task..."
            className="task-input"
            ref={inputRef}
          />
          <button className="add-btn" onClick={addTask}>
            Add Task
          </button>
        </div>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search tasks..."
            className="search-input"
            onChange={searchHandle}
          />
        </div>
        <div className="filter-section">
          <button
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={showAll}
          >
            All
          </button>
          <button
            className={`filter-btn ${activeFilter === "completed" ? "active" : ""}`}
            onClick={showCompleted}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${activeFilter === "pending" ? "active" : ""}`}
            onClick={showPending}
          >
            Pending
          </button>
        </div>
        <div className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((item) => (
              <div className="task-item" key={item.id}>
                <div className="task-left">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleComplete(item.id)}
                  />

                  {editId === item.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                  ) : (
                    <span className="task-text">{item.task}</span>
                  )}
                </div>
                <div className="task-actions">
                  {editId === item.id ? (
                    <button className="edit-btn" onClick={handleSave}>
                      Save
                    </button>
                  ) : (
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  )}

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1 className="no-task">No Task Found</h1>
          )}
        </div>
        <div className="stats">
          <p>Total Tasks: {tasks.length}</p>
          <p>
            Completed:
            {tasks.filter((task) => task.completed).length}
          </p>
          <p>
            Pending:
            {tasks.filter((task) => !task.completed).length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
