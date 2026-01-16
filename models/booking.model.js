const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    detailedInformation: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
      enum: [
        "Elderly Care",
        "Home Nursing",
        "Post-Operative Care",
        "Overnight Care",
        "Medication Support",
      ],
    },
    serviceInfo: {
      startAt: {
        type: String,
        required: true,
      },
      endAt: {
        type: String,
        required: true,
      },
      serviceCycle: {
        type: String,
        required: true,
        enum: ["One-Time", "Recurring"],
      },
    },

    nurseOffers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NurseOffer",
      },
    ],

    amount: {
      subTotal: {
        type: Number,
      },
      processingFee: {
        type: Number,
      },
      total: {
        type: Number,
      },
    },

    status: {
      type: String,
      enum: [
        "requested",
        "matched",
        "confirmed",
        "nurse_arriving",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "requested",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
