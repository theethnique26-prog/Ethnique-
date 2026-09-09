const resolveApiBase = () => {
  let envBase = import.meta.env.VITE_API_BASE;
  if (envBase && typeof envBase === "string") {
    envBase = envBase.trim().replace(/\/+$/, "");
    return envBase.endsWith("/api") ? envBase : `${envBase}/api`;
  }
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  ) {
    return "http://localhost:5000/api";
  }
  return "https://ethnique-api.onrender.com/api";
};

export const API_BASE = resolveApiBase();