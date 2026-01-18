const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    supabaseId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["nurse", "patient", "admin"],
      default: "patient",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
