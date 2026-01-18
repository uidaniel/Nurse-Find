const mongoose = require("mongoose");
const Profile = require("../../models/profile.model.js");
const User = require("../../models/user.model.js");

const updatePricePerHour = async (req, res) => {
  try {
    const { price } = req.body;
    const isANurse = await User.findOne({ _id: req.user.id });
    console.log(isANurse, req.user.email);
    if (isANurse) {
      if (isANurse.role !== "nurse") {
        return res.status(400).json({
          status: 400,
          message: "User is not a nurse",
        });
      }
    } else {
      return res.status(400).json({
        status: 400,
        message: "User not found",
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { pricePerHour: price },
    );
    console.log(profile);
    if (!profile) {
      res.status(404).json({
        status: 404,
        message: "Nurse does not have a profile`",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Nurse price per hour updated successfully",
      profile,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = { updatePricePerHour };
