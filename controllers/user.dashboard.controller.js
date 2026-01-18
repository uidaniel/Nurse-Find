const Booking = require("../models/booking.model.js");
const NurseOffer = require("../models/nurse.offer.model.js");

const getUserDashboardDetails = async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(400).json({
        status: 400,
        message: "Cannot process your request",
      });
    }
    const Bookings = await Booking.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    const NurseOffers = await NurseOffer.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      status: 200,
      message: "User dashboard details fetched successfully",
      recentBookings: Bookings,
      nurseOffers: NurseOffers,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = { getUserDashboardDetails };
