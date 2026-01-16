const express = require("express");
const router = express.Router();
const {
  addBooking,
  getSingleBooking,
  getBookings,
  updateBookingStatus,
} = require("../controllers/booking.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

router.post("/booking/add", protect, addBooking);
router.get("/booking/:id", protect, getSingleBooking);
router.get("/bookings", protect, getBookings);
router.put("/booking/status/:id", protect, updateBookingStatus);

module.exports = router;
