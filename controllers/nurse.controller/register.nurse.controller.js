const express = require("express");
const validateInput = require("../../functions/validate-input.functions.js");
const supabase = require("../../supabase.js");
const Nurse = require("../../models/nurse.model.js");

const registerNurse = async (req, res) => {
  try {
    const { name, email, password, phone, role, accountType } = req.body;

    const validated = validateInput(res, {
      name,
      email,
      phone,
      role,
      accountType,
    });
    if (!validated) return;

    const nurseExists = await Nurse.findOne({ email });
    console.log(nurseExists);
    if (nurseExists) {
      return res.status(400).json({
        status: 400,
        message: "Nurse already exists",
      });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "nurse",
        accountType,
        name,
      },
    });

    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
      });
    }

    if (data.user) {
      const nurse = await Nurse.create({
        name,
        email,
        phone,
        role,
        accountType,
        supabaseId: data.user.id,
      });
      return res.status(201).json({
        status: 200,
        message: "Nurse created successfully",
        nurse,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = { registerNurse };
