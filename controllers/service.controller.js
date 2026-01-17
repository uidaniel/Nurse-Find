const Service = require("../models/services.model.js");
const validateInput = require("../functions/validate-input.functions.js");
const mongoose = require("mongoose");

const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json({
      status: 200,
      message: "Service fetched successfully",
      services,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

const addService = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(400).json({
        status: 400,
        message: "Cannot perform your request",
      });
    }
    const { title, description } = req.body;
    const validated = validateInput(res, { title, description });
    if (!validated) return;

    const service = await Service.create(req.body);
    res.status(201).json({
      status: 201,
      message: "Service added successfully",
      service,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

const editService = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(400).json({
        status: 400,
        message: "Cannot perform your request",
      });
    }
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "Id param is required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: 400,
        message: "Invalid mongo id provided",
      });
    }

    const service = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!service) {
      res.status(404).json({
        status: 404,
        message: "Service not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Service updated successfully",
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(400).json({
        status: 400,
        message: "Cannot perform your request",
      });
    }
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "Id param is required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: 400,
        message: "Invalid mongo id provided",
      });
    }

    const service = await Service.findOneAndDelete(id);
    if (!service) {
      res.status(404).json({
        status: 404,
        message: "Service not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Service deleted successfully",
      service,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = { addService, editService, deleteService, getServices };
