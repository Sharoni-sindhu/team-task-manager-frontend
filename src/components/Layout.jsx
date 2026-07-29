import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="min-h-screen  bg-gray-100">
      <Sidebar />

      <main className="ml-64 p-8 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default Layout;