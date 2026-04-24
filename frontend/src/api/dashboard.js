import api from "./axios";

export const getUserDashboard = () => api.get("/user/dashboard");
