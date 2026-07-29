import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

 console.log("ProtectedRoute token:", token);

  if (!token) {
    console.log("Redirecting to Login...");
    return <Navigate to="/" replace />;
  }

  console.log("Showing Protected Page");
  return children;
}

export default ProtectedRoute;