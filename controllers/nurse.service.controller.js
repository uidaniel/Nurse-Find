const Profile = require("../models/profile.model.js");
const Service = require("../models/services.model.js");
const mongoose = require("mongoose");
const validateInput = require("../functions/validate-input.functions.js");

const addNurseService = async (req, res) => {
  try {
    const { id } = req.body;

    if (req.user.role !== "nurse") {
      return res.status(400).json({
        status: 400,
        message: "Cannot perform this request",
      });
    }

    const validated = validateInput(res, { id });
    if (!validated) return;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid mongo id provided",
      });
    }
    const service = await Service.findById(id);
    const profile = await Profile.findOne({ user: req.user.id }).select(
      "+services"
    );
    console.log(profile);

    if (!service) {
      return res.status(400).json({
        status: 400,
        message: "Service not found ",
      });
    }
    if (profile.services.includes(id)) {
      return res.status(400).json({
        status: 400,
        message: "Service already added to profile",
      });
    }

    profile.services.push(service._id);
    await profile.save();
    res.status(200).json({
      status: 200,
      message: "Service added successfully",
      service: profile.services,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

const removeNurseService = async (req, res) => {
  try {
    const { id } = req.body;

    if (req.user.role !== "nurse") {
      return res.status(400).json({
        status: 400,
        message: "Cannot perform this request",
      });
    }

    const validated = validateInput(res, { id });
    if (!validated) return;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid mongo id provided",
      });
    }

    const profilee = await Profile.findOne({ user: req.user.id }).select(
      "+services"
    );

    if (!profilee.services.includes(id)) {
      return res.status(400).json({
        status: 400,
        message: "Service not in nurse's profile",
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { services: id } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        status: 404,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Service removed successfully",
      services: profile.services,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = { addNurseService, removeNurseService };
