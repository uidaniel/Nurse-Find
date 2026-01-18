const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    address: [
      {
        label: String,
        address: String,
        city: String,
        state: String,
        country: String,
      },
    ],
    bookingHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    rating: {
      type: Number,
      default: 0,
      select: false,
    },
    pricePerHour: {
      type: Number,
      default: null,
      select: false,
    },
    accountType: {
      type: String,
      enum: ["Individual", "Organization"],
      default: "Individual",
      select: false,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        select: false,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", ProfileSchema);
