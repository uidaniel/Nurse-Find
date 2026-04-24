import api from "./axios";

export const getNurseProfile = () => api.get("/nurse/profile");
export const completeNurseProfile = (data) =>
  api.post("/nurse/complete-profile", data);
export const updatePricePerHour = (price) =>
  api.put("/profile/update-pph", { price });
export const toggleActiveStatus = () =>
  api.post("/nurse/toggle-active-status");

export const addNurseService = (id) => api.post("/add-nurse-service", { id });
export const removeNurseService = (id) =>
  api.post("/remove-nurse-service", { id });

export const createOffer = (data) => api.post("/offer/add", data);
export const getOffer = (id) => api.get(`/offer/${id}`);
export const editOffer = (id, data) => api.put(`/offer/${id}`, data);
export const deleteOffer = (id) => api.delete(`/offer/delete/${id}`);
