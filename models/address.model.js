const mongoose = require("mongoose");

const obj = {
  type: String,
  required: true,
};

const AddressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: obj,
    address: obj,
    city: obj,
    state: obj,
    country: obj,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
