import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

function Tasks() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // New states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: user.id,
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/tasks", formData);

      toast.success("Task Created Successfully!");

      setFormData({
        title: "",
        description: "",
        project: "",
        assignedTo: user.id,
        priority: "Medium",
        dueDate: "",
      });

      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}/status`, { status });

      toast.success("Task Status Updated!");

      fetchTasks();
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);

      toast.success("Task Deleted Successfully!");

      fetchTasks();
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">Tasks</h1>

      {user?.role === "Admin" && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-5">
            Create New Task
          </h2>

          <form onSubmit={createTask}>
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              name="description"
              placeholder="Task Description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
              required
            >
              <option value="">Select Project</option>

              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white px-6 py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Task..." : "Create Task"}
            </button>
          </form>
        </div>
      )}

      {/* Search & Filters */}

      <div className="bg-white shadow-lg rounded-xl p-5 mb-8">
        <div className="grid md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="🔍 Search Tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-3"
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-3"
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-10 text-center text-gray-500 text-lg">
          {search || statusFilter !== "All" || priorityFilter !== "All"
            ? "No matching tasks found."
            : "No tasks found. Create your first task!"}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                {task.title}
              </h2>

              <p className="mt-3 text-gray-600">
                {task.description}
              </p>

              <div className="mt-4 space-y-2">
                <p>
                  <strong>Status:</strong> {task.status}
                </p>

                <p>
                  <strong>Priority:</strong> {task.priority}
                </p>

                <p>
                  <strong>Project:</strong>{" "}
                  {task.project?.title || "N/A"}
                </p>

                <p>
                  <strong>Due Date:</strong>{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">

                <button
                  onClick={() =>
                    updateStatus(task._id, "In Progress")
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                >
                  In Progress
                </button>

                <button
                  onClick={() =>
                    updateStatus(task._id, "Completed")
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Complete
                </button>

                {user?.role === "Admin" && (
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Tasks;