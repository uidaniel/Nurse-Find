const NurseOffer = require("../../models/nurse.offer.model.js");
const mongoose = require("mongoose");
const validateInput = require("../../functions/validate-input.functions.js");

const createOffer = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    // if (!mongoose.Types.ObjectId.isValid(nurse)) {
    //   return res.status(401).json({
    //     status: 401,
    //     message: "Invalid nurse id provided",
    //   });
    // }
    const validated = validateInput(res, { title, description, price });
    if (!validated) return;
    if (req.user.role !== "nurse") {
      return res.status(400).json({
        status: 400,
        message: "User is not a nurse",
      });
    }
    const offer = await NurseOffer.create({
      title,
      description,
      price,
      nurse: req.user.id,
    });
    res.status(201).json({
      status: 201,
      message: "Offer created successfulluy",
      offer,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

const editOffer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid mongo id provided",
      });
    }
    const offer = await NurseOffer.findByIdAndUpdate(id, req.body);
    if (!offer) {
      return res.status(404).json({
        status: 404,
        message: "Offer does not exist",
      });
    }
    res.status(200).json({
      status: 200,
      offer,
      message: "Offer edited succcessfully",
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};
const getOffer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid mongo id provided",
      });
    }
    const offer = await NurseOffer.findById(id);
    if (!offer) {
      return res.status(404).json({
        status: 404,
        message: "Offer does not exist",
      });
    }
    res.status(200).json({
      status: 200,
      offer,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid mongo id provided",
      });
    }
    const offer = await NurseOffer.findByIdAndDelete(id);
    if (!offer) {
      return res.status(404).json({
        status: 404,
        message: "Offer does not exist",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Offer deleted successfully",
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = { createOffer, editOffer, getOffer, deleteOffer };
