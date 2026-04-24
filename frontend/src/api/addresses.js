import api from "./axios";

export const getAddresses = () => api.get("/address");
export const addAddress = (data) => api.post("/address/add", data);
export const updateAddress = (data) => api.post("/address", data);
