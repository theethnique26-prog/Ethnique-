import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  let user = null;

  try {
    const raw = localStorage.getItem("user") || localStorage.getItem("adminInfo") || localStorage.getItem("admin");
    if (raw) user = JSON.parse(raw);
  } catch {
    user = null;
  }

  if (!token || !user) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  if (user.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;