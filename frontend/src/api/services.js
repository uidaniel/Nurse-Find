import api from "./axios";

export const getServices = () => api.get("/services");
export const addService = (data) => api.post("/services/add", data);
export const editService = (id, data) => api.put(`/services/edit/${id}`, data);
export const deleteService = (id) => api.delete(`/services/delete/${id}`);
