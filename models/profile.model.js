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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
