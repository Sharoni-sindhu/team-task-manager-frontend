import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data.dashboard);
    } catch (error) {
      console.log(error);
      alert("Failed to load dashboard");
    }
  };

  const cards = [
    { title: "Total Tasks", value: stats.totalTasks, color: "bg-blue-500" },
    { title: "Pending", value: stats.pending, color: "bg-yellow-500" },
    { title: "In Progress", value: stats.inProgress, color: "bg-purple-500" },
    { title: "Completed", value: stats.completed, color: "bg-green-500" },
    { title: "Overdue", value: stats.overdue, color: "bg-red-500" },
  ];

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.color} text-white rounded-xl shadow-lg p-6 hover:scale-105 transition duration-300`}
          >
            <h2 className="text-lg font-semibold">{card.title}</h2>

            <p className="text-4xl font-bold mt-4">{card.value}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Dashboard;