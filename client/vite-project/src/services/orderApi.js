import { API_BASE } from "./apiConfig";

const BASE_URL = `${API_BASE}/orders`;

const getHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

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
  async getMyOrders() {
  const response = await fetch(
    `${BASE_URL}/my-orders`,
    {
      headers: getHeaders(),
    }
  );

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

  // =====================================
  // DELHIVERY LOGISTICS INTEGRATION
  // =====================================
  async shipWithDelhivery(orderId) {
    const response = await fetch(`${API_BASE}/delhivery/ship/${orderId}`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async checkDelhiveryServiceability(pincode) {
    const response = await fetch(`${API_BASE}/delhivery/serviceability/${pincode}`);
    return handleResponse(response);
  },

  async trackDelhivery(waybill) {
    const response = await fetch(`${API_BASE}/delhivery/track/${waybill}`);
    return handleResponse(response);
  },
};

export default orderApi;