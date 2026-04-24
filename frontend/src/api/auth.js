import api from "./axios";

export const registerPatient = (data) => api.post("/auth/user/register", data);
export const loginPatient = (data) => api.post("/auth/user/login", data);
export const registerNurse = (data) => api.post("/auth/nurse/register", data);
export const loginNurse = (data) => api.post("/auth/nurse/login", data);
