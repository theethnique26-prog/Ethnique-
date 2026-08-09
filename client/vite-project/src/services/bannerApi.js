import adminApi from "./adminApi";

const bannerApi = {
  getAll: () =>
    adminApi.get("/banners"),

  create: (data) =>
    adminApi.post("/banners", data),

  update: (id, data) =>
    adminApi.put(`/banners/${id}`, data),

  remove: (id) =>
    adminApi.delete(`/banners/${id}`),
};

export default bannerApi;