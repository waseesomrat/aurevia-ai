"use client";

import { useEffect, useState } from "react";

export default function TodoPage() {
  const [task, setTask] = useState("");
 

const [tasks, setTasks] = useState(() => {
  if (typeof window !== "undefined") {
    const saved =
      localStorage.getItem("todo");

    return saved
      ? JSON.parse(saved)
      : [];
  }

  return [];
});

  const addTask = () => {
    if (!task.trim()) return;

    setTasks([
      ...tasks,
      {
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  const toggleTask = (index) => {
    const updated = [...tasks];

    updated[index].completed =
      !updated[index].completed;

    setTasks(updated);
  };

  const deleteTask = (index) => {
    const updated = tasks.filter(
      (_, i) => i !== index
    );

    setTasks(updated);
  };

  useEffect(() => {
  localStorage.setItem(
    "todo",
    JSON.stringify(tasks)
  );
}, [tasks]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "50px",
      }}
    >
      <h1
        style={{
          color: "#d8b4fe",
          fontSize: "60px",
          marginBottom: "30px",
        }}
      >
        Goals & To-Do
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          value={task}
          onChange={(e) =>
            setTask(e.target.value)
          }
          placeholder="Apply to Google Internship"
          style={{
            flex: 1,
            padding: "15px",
            borderRadius: "12px",
          }}
        />

        <button
          onClick={addTask}
          style={{
            background: "#9333ea",
            color: "white",
            border: "none",
            padding: "15px 25px",
            borderRadius: "12px",
          }}
        >
          Add
        </button>
      </div>

      <div
        style={{
          marginTop: "30px",
        }}
      >
        {tasks.map((task, index) => (
          <div
            key={index}
            style={{
              background: "#081225",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "15px",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  toggleTask(index)
                }
              />

              <span
                style={{
                  marginLeft: "12px",
                  textDecoration:
                    task.completed
                      ? "line-through"
                      : "none",
                }}
              >
                {task.text}
              </span>
            </div>

            <button
              onClick={() =>
                deleteTask(index)
              }
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "8px",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}