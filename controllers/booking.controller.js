const validateInput = require("../functions/validate-input.functions.js");
const Booking = require("../models/booking.model.js");
const User = require("../models/user.model.js");
const Profile = require("../models/profile.model.js");
const mongoose = require("mongoose");

const addBooking = async (req, res) => {
  try {
    const {
      nurse,
      detailedInformation,
      address,
      service,
      serviceInfo,
      nurseOffers,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(nurse)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid nurse mongo id provided",
      });
    }

    const validated = validateInput(res, {
      nurse,
      detailedInformation,
      address,
      service,
      serviceInfo,
      nurseOffers,
    });
    if (!validated) return;

    if (!serviceInfo || !serviceInfo.startAt || !serviceInfo.endAt) {
      return res.status(400).json({
        status: 400,
        message: "serviceInfo.startAt and serviceInfo.endAt are required",
      });
    }

    const isValidTimestamp = (value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    };

    if (!isValidTimestamp(serviceInfo.startAt)) {
      return res.status(400).json({
        status: 400,
        message: "serviceInfo.startAt must be a valid ISO timestamp",
      });
    }

    if (!isValidTimestamp(serviceInfo.endAt)) {
      return res.status(400).json({
        status: 400,
        message: "serviceInfo.endAt must be a valid ISO timestamp",
      });
    }

    const isANurse = await User.findOne({ _id: nurse, role: "nurse" });
    if (!isANurse) {
      return res.status(400).json({
        status: 400,
        message: "Nurse not found",
      });
    }

    const nurseProfile = await Profile.findOne({ user: isANurse._id });
    if (!nurseProfile) {
      return res.status(400).json({
        status: 400,
        message: "Nurse profile not found",
      });
    }
    const getDurationInHours = (startAt, endAt) => {
      const start = new Date(startAt);
      const end = new Date(endAt);

      const diffInMs = end - start;
      const diffInHours = diffInMs / (1000 * 60 * 60);

      return diffInHours;
    };

    console.log(serviceInfo);

    const durationInHours = getDurationInHours(
      serviceInfo.startAt,
      serviceInfo.endAt
    );
    console.log(durationInHours);
    const pricePerHour = nurseProfile.pricePerHour;

    const booking = await Booking.create({
      ...req.body,
      user: req.user.id,
      amount: {
        subTotal: Number(pricePerHour * durationInHours),
        processingFee: 30,
        total: Number(pricePerHour * durationInHours + 30),
      },
      status: "requested",
    });
    res.status(201).json({
      status: 201,
      message: "Booking created successfully",
      booking,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

const getSingleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid mongo id",
      });
    }
    const validated = validateInput(res, {
      id,
    });
    if (!validated) return;
    const booking = await Booking.findById(id).populate(["nurseOffers"]);

    const nurseInfo = await Profile.findOne({ user: booking.nurse })
      .populate("user")
      .select("+pricePerHour +rating +accountType -bookingHistory");
    console.log(nurseInfo);

    if (!booking) {
      return res.status(404).json({
        status: 400,
        message: "Booking not found",
      });
    }
    res.status(201).json({
      status: 200,
      booking,
      nurseInfo,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    if (!validated) return;
    const bookings = await Booking.findById({ user: req.user.id });
    if (!bookings) {
      return res.status(404).json({
        status: 404,
        message: "User does not have any booking",
      });
    }
    res.status(201).json({
      status: 200,
      bookings,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid mongo Id provided",
      });
    }
    if (!status) {
      return res.status(400).json({
        status: 400,
        message: "status field is required",
      });
    }
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    console.log(booking);
    if (!booking) {
      return res.status(400).json({
        status: 400,
        message: "Booking not found",
      });
    }
    console.log(booking.user.toString(), req.user.id.toString());
    if (booking.user.toString() !== req.user.id.toString()) {
      return res.status(400).json({
        status: 400,
        message: "Cannot update status of user booking",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Status updated successfully",
      booking,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = {
  addBooking,
  getSingleBooking,
  getBookings,
  updateBookingStatus,
};
