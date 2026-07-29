import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 p-6">

      <h1 className="text-2xl font-bold mb-10">
        Team Manager
      </h1>


<div className="mb-8">
  <p className="text-gray-300">Welcome,</p>
  <p className="font-bold">{user?.name}</p>
</div>
      <nav className="flex flex-col gap-4">

        <Link
          to="/dashboard"
          className="hover:bg-gray-700 p-3 rounded"
        >
          Dashboard
        </Link>

        <Link
          to="/projects"
          className="hover:bg-gray-700 p-3 rounded"
        >
          Projects
        </Link>

        <Link
          to="/tasks"
          className="hover:bg-gray-700 p-3 rounded"
        >
          Tasks
        </Link>

        <button
          onClick={logout}
          className="bg-red-500 mt-10 p-3 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </nav>

    </div>
  );
}

export default Sidebar;