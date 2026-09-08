import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { API_BASE } from "../services/apiConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      if (!token) return null;
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    setUser(null);
  };

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

      if (!token) {
        // Clear any orphaned user or admin session info
        localStorage.removeItem("user");
        localStorage.removeItem("admin");
        localStorage.removeItem("adminToken");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", token);
            if (data.user.role === "admin") {
              localStorage.setItem("adminToken", token);
              localStorage.setItem("admin", JSON.stringify(data.user));
            }
          } else {
            logout();
          }
        } else if (res.status === 401 || res.status === 403) {
          // Token expired or invalid: clear session
          logout();
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    if (userData?.role === "admin") {
      localStorage.setItem("adminToken", token);
      localStorage.setItem("admin", JSON.stringify(userData));
    }

    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);