import { API_BASE } from "./apiConfig";

const getHeaders = (includeAuth = false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return response.json();
};

const customerApi = {
  async get(endpoint, auth = false) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: getHeaders(auth),
    });

    return handleResponse(response);
  },

  async post(endpoint, body, auth = false) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: getHeaders(auth),
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  async put(endpoint, body, auth = false) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(auth),
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  async delete(endpoint, auth = false) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(auth),
    });

    return handleResponse(response);
  },
};

export default customerApi;