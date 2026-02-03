"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@lib/api";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import { Search } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskInput, setTaskInput] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [deletingTask, setDeletingTask] = useState(null);

  // Fetch profile and tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get("/me");
        setProfile(profileRes.data);

        const tasksRes = await api.get("/tasks");
        setTasks(tasksRes.data);
      } catch (err) {
        router.push("/login"); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Filter and search tasks
  const filteredTasks = tasks.filter((task) => {
    // Filter by status
    if (filter === "completed" && !task.completed) return false;
    if (filter === "pending" && task.completed) return false;

    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskInput) return;
    const res = await api.post("/tasks", { title: taskInput });
    setTasks([res.data, ...tasks]);
    setTaskInput("");
  };

  // Delete task
  const handleDeleteClick = (task) => {
    setDeletingTask(task);
  };

  const confirmDelete = async () => {
    if (!deletingTask) return;
    await api.delete(`/tasks/${deletingTask._id}`);
    setTasks(tasks.filter((t) => t._id !== deletingTask._id));
    setDeletingTask(null);
  };

  const cancelDelete = () => {
    setDeletingTask(null);
  };

  // Toggle complete
  const handleToggle = async (task) => {
    const res = await api.put(`/tasks/${task._id}`, {
      completed: !task.completed,
    });
    setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
  };

  // Open edit modal
  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditInput(task.title);
  };

  // Save edited task
  const handleEditSave = async () => {
    if (!editInput.trim()) return;
    try {
      const res = await api.put(`/tasks/${editingTask._id}`, {
        title: editInput,
      });
      setTasks(tasks.map((t) => (t._id === editingTask._id ? res.data : t)));
      setEditingTask(null);
      setEditInput("");
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  // Close edit modal
  const handleEditCancel = () => {
    setEditingTask(null);
    setEditInput("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar profile={profile} />

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Add Task */}
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <form onSubmit={handleAddTask} className="flex gap-3">
            <input
              type="text"
              placeholder="Add a new task..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="flex-1 px-4 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-linear-to-r from-indigo-500 to-purple-700 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  filter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  filter === "pending"
                    ? "bg-indigo-600 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  filter === "completed"
                    ? "bg-indigo-600 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">
              {filter === "all" && `All Tasks (${filteredTasks.length})`}
              {filter === "pending" && `Active Tasks (${filteredTasks.length})`}
              {filter === "completed" && `Completed (${filteredTasks.length})`}
            </h2>
          </div>
          
          {filteredTasks.length > 0 ? (
            <table className="w-full">
              <tbody>
                <AnimatePresence>
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDelete={() => handleDeleteClick(task)}
                      onToggle={() => handleToggle(task)}
                      onEdit={() => handleEditClick(task)}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-16 text-center">
              <svg
                className="mx-auto w-12 h-12 mb-3 text-neutral-300"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <p className="text-sm text-neutral-500">
                {tasks.length === 0 ? "No tasks yet. Add your first task above!" : "No tasks found"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deletingTask && (
          <div
            onClick={cancelDelete}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Delete Task
              </h3>
              <p className="text-sm text-neutral-600 mb-6">
                Are you sure you want to delete &quot;{deletingTask.title}&quot;? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-2 bg-neutral-100 text-neutral-700 text-sm rounded-md hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTask && (
          <div
            onClick={handleEditCancel}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Edit Task
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                  className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  autoFocus
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleEditSave}
                    className="flex-1 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="flex-1 py-2 bg-neutral-100 text-neutral-700 text-sm rounded-md hover:bg-neutral-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
