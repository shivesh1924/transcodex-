import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { v4 as uuidv4 } from "uuid";

const dataUrl = "https://jsonplaceholder.typicode.com/todos";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(dataUrl);
      //   console.log("res__", response.data);
      setTasks(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error", error);
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask) {
      alert("Task title is required");
      return;
    }

    try {
      const response = await axios.post(dataUrl, {
        id: uuidv4(),
        title: newTask,
        completed: false,
      });
      console.log("res__", response.data);
      setTasks((prevTasks) => [response.data, ...prevTasks]);
      //   setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("error", error);
    }
  };

  const editTask = async () => {
    if (!editedTaskTitle) {
      alert("title is required");
      return;
    }

    try {
      await axios.patch(`${dataUrl}/${editTaskId}`, {
        title: editedTaskTitle,
      });

      const updatedTasks = tasks.map((task) =>
        task.id === editTaskId ? { ...task, title: editedTaskTitle } : task
      );

      setTasks(updatedTasks);
      setEditTaskId(null);
      setEditedTaskTitle("");
    } catch (error) {
      console.error("Error", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${dataUrl}/${taskId}`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const editTitle = (taskId, taskTitle) => {
    setEditTaskId(taskId);
    setEditedTaskTitle(taskTitle);
  };
  console.log("tasks__", tasks);
  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <input
          className="custom-input"
          type="text"
          placeholder="Task Title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask} className="custom-button custom-button">
          Add Task
        </button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Title</th>
              <th className="actionCoulum">Actions</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody className="loaderCenter">
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id}>
                  {/* <td>{task.id}</td> */}
                  <td>
                    {editTaskId === task.id ? (
                      <input
                        className="custom-input"
                        type="text"
                        value={editedTaskTitle}
                        onChange={(e) => setEditedTaskTitle(e.target.value)}
                      />
                    ) : (
                      task.title
                    )}
                  </td>
                  <td>
                    {editTaskId === task.id ? (
                      <div className="actionCoulum">
                        <button
                          className="custom-button custom-button-update"
                          onClick={editTask}
                        >
                          Update
                        </button>
                      </div>
                    ) : (
                      <div className="actionCoulum">
                        <button
                          className="custom-button custom-button-edit"
                          onClick={() => editTitle(task.id, task.title)}
                        >
                          Edit
                        </button>
                        <button
                          className="custom-button custom-button-delete"
                          onClick={() => deleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default App;
