const validateInput = require("../functions/validate-input.functions.js");
const Profile = require("../models/profile.model.js");

const getProfile = async (req, res) => {
  try {
    console.log(req.user);
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "address"
    );

    if (!profile) {
      return res.status(400).json({
        status: 400,
        message: "Profile not found",
      });
    }
    res.status(200).json({
      status: 200,
      profile,
    });
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message });
  }
};

module.exports = { getProfile };
