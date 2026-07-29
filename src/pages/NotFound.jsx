import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-7xl font-bold text-red-600">404</h1>

      <p className="text-2xl mt-4 font-semibold">
        Page Not Found
      </p>

      <p className="text-gray-600 mt-2">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Go to Login
      </Link>
    </div>
  );
}

export default NotFound;