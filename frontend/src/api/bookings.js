import api from "./axios";

export const createBooking = (data) => api.post("/booking/add", data);
export const getBooking = (id) => api.get(`/booking/${id}`);
export const getBookings = () => api.get("/bookings");
export const updateBookingStatus = (id, status) =>
  api.put(`/booking/status/${id}`, { status });
