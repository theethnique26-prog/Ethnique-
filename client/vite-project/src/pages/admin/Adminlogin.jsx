import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "https://ethnique-bmae.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return alert(data.message || "Login failed");
    }

    if (data.user.role !== "admin") {
      return alert("Only admins can access this page.");
    }

    login(data.user, data.token);

    navigate("/admin/dashboard");

  } catch (error) {
    console.log(error);
    alert("Login failed");
  }
};


    return (
  <div
    className="
      min-h-screen
      bg-gradient-to-br
      from-[#F8F5F2]
      via-white
      to-[#F3EEE7]
      flex
      items-center
      justify-center
      px-4
    "
  >
    <div
      className="
        w-full
        max-w-md
        bg-white/90
        backdrop-blur-lg
        rounded-3xl
        shadow-2xl
        border
        border-[#E8E2DC]
        p-10
      "
    >
      {/* Logo / Brand */}
      <div className="text-center mb-8">
        <h1
          className="
            text-4xl
            font-serif
            text-[#6D1830]
          "
        >
          ETHNIQUE
        </h1>

        <p className="text-gray-500 mt-2">
          Admin Dashboard Access
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@ethnique.com"
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-[#DDD]
              focus:outline-none
              focus:ring-2
              focus:ring-[#6D1830]
            "
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-[#DDD]
              focus:outline-none
              focus:ring-2
              focus:ring-[#6D1830]
            "
          />
        </div>

        <button
          type="submit"
          className="
            w-full
            py-3
            rounded-xl
            bg-[#6D1830]
            text-white
            font-medium
            hover:bg-[#571225]
            transition-all
            duration-300
            shadow-lg
          "
        >
          Login to Dashboard
        </button>
      </form>

      <div className="mt-6 text-center">
        {/* <p className="text-xs text-gray-400">
          Ethnique Admin Portal
        </p> */}
      </div>
    </div>
  </div>
);
}

export default AdminLogin;