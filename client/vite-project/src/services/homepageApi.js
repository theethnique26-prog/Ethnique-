import { API_BASE } from "./apiConfig";

const BASE = `${API_BASE}/homepage`;

const headers = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

const homepageApi = {
  async getHomepage() {
    const res = await fetch(BASE);
    return res.json();
  },

  async updateHomepage(data) {
    const res = await fetch(BASE, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });

    return res.json();
  },
};

export default homepageApi;