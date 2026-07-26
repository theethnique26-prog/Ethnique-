import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "https://ethnique.onrender.com/api/auth/login"
      : "https://ethnique.onrender.com/api/auth/signup";

    const body = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // 🔥 Handle non-JSON responses safely
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      console.log("Status:", res.status);
console.log("Response:", data);

      if (!res.ok) {
        // backend sent error (like 400 or 500)
        throw new Error(data.msg || "Login failed");
      }

      // ✅ success
     // Save user in AuthContext
login(data.user, data.token);

// Save in localStorage
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));

// Redirect based on role
if (data.user.role === "admin") {
  navigate("/admin/dashboard");
} else {
  navigate("/");
}

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.message || "Server error");
    }
  };

  return (
  <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center px-4">

    <div
      className="
      w-full
      max-w-md
      bg-white
      rounded-3xl
      shadow-xl
      border
      border-[#ECE6DE]
      p-10
    "
    >
      <div className="text-center mb-8">

        <p className="text-sm tracking-[4px] text-[#B08B57] uppercase">
          Ethnique by Jayant
        </p>

        <h2 className="text-3xl font-serif text-[#6D1830] mt-3">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-gray-500 mt-2">
          {isLogin
            ? "Login to continue shopping"
            : "Join the Ethnique family"}
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="
              w-full
              border
              border-[#DDD]
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-[#6D1830]
            "
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            w-full
            border
            border-[#DDD]
            rounded-xl
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-[#6D1830]
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            w-full
            border
            border-[#DDD]
            rounded-xl
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-[#6D1830]
          "
        />

        <button
          type="submit"
          className="
            w-full
            bg-[#6D1830]
            text-white
            py-3
            rounded-xl
            font-medium
            hover:bg-[#551224]
            transition-all
            duration-300
          "
        >
          {isLogin
            ? "Login"
            : "Create Account"}
        </button>
      </form>

      <div className="mt-8 text-center">

        <p className="text-gray-600">

          {isLogin
            ? "New to Ethnique?"
            : "Already have an account?"}

          <button
            onClick={() =>
              setIsLogin(!isLogin)
            }
            className="
              ml-2
              text-[#6D1830]
              font-medium
              hover:underline
            "
          >
            {isLogin
              ? "Create Account"
              : "Login"}
          </button>

        </p>

      </div>

    </div>

  </div>
);
};

export default Login; 