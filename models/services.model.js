const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  searchCount: {
    type: Number,
    default: 0,
    select: false,
  },
});

module.exports = mongoose.model("Service", ServiceSchema);
