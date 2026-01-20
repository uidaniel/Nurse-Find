const Nurse = require("../../models/nurse.model.js");
const Service = require("../../models/services.model.js");
const mongoose = require("mongoose");
const validateInput = require("../../functions/validate-input.functions.js");

/* ================= ADD SPECIALIZATION ================= */
const addNurseService = async (req, res) => {
  try {
    const { id } = req.body;

    if (req.user.role !== "nurse") {
      return res.status(403).json({
        success: false,
        message: "Only nurses can add services",
      });
    }

    const validated = validateInput(res, { id });
    if (!validated) return;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid MongoDB ID",
      });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const nurse = await Nurse.findById(req.user.id).select(
      "+nursingInformation",
    );

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: "Nurse profile not found",
      });
    }

    if (!nurse.nursingInformation) {
      nurse.nursingInformation = { areaOfSpecialization: [] };
    }

    const exists = nurse.nursingInformation.areaOfSpecialization.includes(id);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Service already added",
      });
    }

    nurse.nursingInformation.areaOfSpecialization.push(service._id);
    await nurse.save();

    const populatedNurse = await Nurse.findById(req.user.id)
      .select("+nursingInformation")
      .populate("nursingInformation.areaOfSpecialization");

    return res.status(200).json({
      success: true,
      message: "Service added successfully",
      services: populatedNurse.nursingInformation.areaOfSpecialization,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

/* ================= REMOVE SPECIALIZATION ================= */
const removeNurseService = async (req, res) => {
  try {
    const { id } = req.body;

    if (req.user.role !== "nurse") {
      return res.status(403).json({
        success: false,
        message: "Only nurses can remove services",
      });
    }

    const validated = validateInput(res, { id });
    if (!validated) return;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid MongoDB ID",
      });
    }

    const nurse = await Nurse.findById(req.user.id).select(
      "+nursingInformation",
    );

    if (!nurse || !nurse.nursingInformation) {
      return res.status(404).json({
        success: false,
        message: "Nurse profile not found",
      });
    }

    const exists = nurse.nursingInformation.areaOfSpecialization.includes(id);
    if (!exists) {
      return res.status(400).json({
        success: false,
        message: "Service not in nurse specialization list",
      });
    }

    await Nurse.findByIdAndUpdate(
      req.user.id,
      { $pull: { "nursingInformation.areaOfSpecialization": id } },
      { new: true },
    );

    const populatedNurse = await Nurse.findById(req.user.id)
      .select("+nursingInformation")
      .populate("nursingInformation.areaOfSpecialization");

    return res.status(200).json({
      success: true,
      message: "Service removed successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
2;

module.exports = { addNurseService, removeNurseService };
