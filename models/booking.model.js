const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
    date: String,
    duraction: String,
    serviceCycle: String,
    price: String,
    required: true,
  },
  nurseOffers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NurseOffer",
  },
  amount: {
    subTotal: Number,
    processingFee: Number,
    total: Number,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
