import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createProject = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/projects", formData);

      toast.success("Project Created Successfully!");

      setFormData({
        title: "",
        description: "",
      });

      fetchProjects();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error creating project"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);

      toast.success("Project Deleted Successfully!");

      fetchProjects();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">Projects</h1>

      {user?.role === "Admin" && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-5">
            Create New Project
          </h2>

          <form onSubmit={createProject}>
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              name="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Project..." : "Create Project"}
            </button>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search Projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-10 text-center text-gray-500 text-lg">
          {search
            ? "No matching projects found."
            : "No projects found. Create your first project!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                {project.title}
              </h2>

              <p className="mt-3 text-gray-600">
                {project.description}
              </p>

              {user?.role === "Admin" && (
                <button
                  onClick={() => deleteProject(project._id)}
                  className="mt-6 bg-red-500 hover:bg-red-600 transition duration-300 text-white px-5 py-2 rounded-lg"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Projects;