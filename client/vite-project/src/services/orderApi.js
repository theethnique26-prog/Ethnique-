import { API_BASE } from "./apiConfig";

const BASE_URL = `${API_BASE}/orders`;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

const orderApi = {
  async getOrders() {
    const response = await fetch(BASE_URL, {
      headers: getHeaders(),
    });

    return handleResponse(response);
  },

  async getOrder(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: getHeaders(),
    });

    return handleResponse(response);
  },

  async updateStatus(id, orderStatus) {
    const response = await fetch(
      `${BASE_URL}/${id}/status`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ orderStatus }),
      }
    );

    return handleResponse(response);
  },

  async deleteOrder(id) {
    const response = await fetch(
      `${BASE_URL}/${id}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    return handleResponse(response);
  },
};

export default orderApi;