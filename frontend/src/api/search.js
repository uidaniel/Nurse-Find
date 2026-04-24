import api from "./axios";

export const searchNurses = (query, sort) =>
  api.get(`/search/${encodeURIComponent(query)}`, { params: { sort } });
export const getPopularSearches = () => api.get("/popular");
