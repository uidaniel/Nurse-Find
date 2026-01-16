const validateInput = require("../functions/validate-input.functions.js");
const Address = require("../models/address.model.js");
const mongoose = require("mongoose");

const getAddresses = async (req, res) => {
  console.log(req.user);
  const addresses = await Address.find({ user: req.user.id });
  try {
    if (!addresses) {
      return res.status(400).json({
        status: 400,
        message: "No addresses added",
      });
    }
    res.status(200).json({
      status: 200,
      addresses,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

const addAddress = async (req, res) => {
  const { user, label, address, city, state, country } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid mongo id",
      });
    }
    const validated = validateInput(res, {
      user,
      label,
      address,
      city,
      state,
      country,
    });
    if (!validated) return;
    const addressCreated = await Address.create(req.body);
    res.status(200).json({
      status: 200,
      addressCreated,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

const updateAddress = async (req, res) => {
  const { id, user } = req.body;

  try {
    const validated = validateInput(res, { id, user });
    if (!validated) return;
    const addresses = Address.findByIdAndUpdate(id, req.body);
    if (addresses) {
      return res.status(400).json({
        status: 400,
        message: "No address added",
      });
    }
    res.status(200).json({
      status: 200,
      addresses,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = { getAddresses, addAddress, updateAddress };
