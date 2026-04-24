const Profile = require("../../models/profile.model.js");
const Nurse = require("../../models/nurse.model.js");

const updatePricePerHour = async (req, res) => {
  try {
    const { price } = req.body;
    const nurse = await Nurse.findOne({ _id: req.user.id });
    if (!nurse) {
      return res.status(404).json({
        status: 404,
        message: "Nurse not found",
      });
    }
    if (nurse.role !== "nurse") {
      return res.status(403).json({
        status: 403,
        message: "User is not a nurse",
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { pricePerHour: price },
      { new: true },
    );
    if (!profile) {
      return res.status(404).json({
        status: 404,
        message: "Nurse does not have a profile",
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
