import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const TaskPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Task filtering
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch project details
        const projectResponse = await axios.get(
          `${API_BASE_URL}/api/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProject(projectResponse.data);

        // Fetch tasks for the project
        const tasksResponse = await axios.get(
          `${API_BASE_URL}/api/tasks?projectId=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(tasksResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load project data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [projectId, navigate]);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title) {
      setError("Task title is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/api/tasks`,
        {
          title,
          description,
          projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new task to the list
      setTasks([...tasks, response.data.task]);

      // Reset form
      setTitle("");
      setDescription("");
      setShowTaskForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      setError("");
      const token = localStorage.getItem("token");

      const taskToUpdate = tasks.find((task) => task._id === taskId);

      const response = await axios.put(
        `${API_BASE_URL}/api/tasks/${taskId}`,
        {
          title: taskToUpdate.title,
          description: taskToUpdate.description,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the task in the list
      setTasks(
        tasks.map((task) => (task._id === taskId ? response.data.task : task))
      );
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setError("");
      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the task from the list
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((task) => task.status === filter);
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          (task.description && task.description.toLowerCase().includes(term))
      );
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Project Header */}
        {project && (
          <div className="mb-8 bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {project.title}
                </h1>
                {project.description && (
                  <p className="text-gray-400 mb-2">{project.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm transition flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Projects
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              {error}
            </div>
            <button
              onClick={() => setError("")}
              className="text-white hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        )}

        {/* Task Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-semibold text-purple-400 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                ></path>
              </svg>
              Tasks
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className={`${
                showTaskForm
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              } px-4 py-2 rounded text-sm font-medium transition flex items-center`}
            >
              {showTaskForm ? (
                <>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Add Task
                </>
              )}
            </button>
          </div>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg border border-gray-700 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">
              Create New Task
            </h3>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Task Title*
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                  placeholder="Enter task title"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-purple-500 h-24"
                  placeholder="Enter task description"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-4 py-2 rounded font-medium transition disabled:opacity-50 flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      Create Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        {getFilteredTasks().length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center shadow-md border border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg text-gray-300 mb-2">
              {tasks.length === 0
                ? "No tasks yet. Create one to get started!"
                : "No tasks match your filters."}
            </h3>
            {tasks.length > 0 && (
              <button
                onClick={() => {
                  setFilter("all");
                  setSearchTerm("");
                }}
                className="text-purple-400 hover:text-purple-300 transition text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {getFilteredTasks().map((task) => (
              <div
                key={task._id}
                className="bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700 hover:border-gray-600 transition duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start">
                    <div
                      className={`w-3 h-3 mt-1.5 mr-3 rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    ></div>
                    <h3 className="text-xl font-semibold text-white">
                      {task.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>

                {task.description && (
                  <div className="mb-4 pl-6">
                    <p className="text-gray-400">{task.description}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pl-6 space-y-3 sm:space-y-0">
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1).replace("-", " ")}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    {task.completedAt && (
                      <span className="text-xs text-green-500 ml-2">
                        Completed:{" "}
                        {new Date(task.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {task.status !== "pending" && (
                      <button
                        onClick={() => handleUpdateStatus(task._id, "pending")}
                        className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white rounded transition"
                      >
                        Set Pending
                      </button>
                    )}
                    {task.status !== "in-progress" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(task._id, "in-progress")
                        }
                        className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                      >
                        Set In Progress
                      </button>
                    )}
                    {task.status !== "completed" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(task._id, "completed")
                        }
                        className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition"
                      >
                        Set Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
