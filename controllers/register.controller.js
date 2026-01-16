const express = require("express");
const validateInput = require("../functions/validate-input.functions.js");
const supabase = require("../supabase.js");
const User = require("../models/user.model.js");
const Profile = require("../models/profile.model.js");

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const validated = validateInput(res, { name, email, phone, role });
    if (!validated) return;

    const userExists = await User.findOne({ email });
    console.log(userExists);
    if (userExists) {
      return res.status(400).json({
        status: 400,
        message: "User already exists",
      });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
    console.log(data);
    if (data.user) {
      const user = await User.create({
        name,
        email,
        phone,
        role,
        supabaseId: data.user.id,
      });
      await Profile.create({ user: user._id });
      return res.status(201).json({
        status: 200,
        message: "User created successfully",
        user,
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

module.exports = { register };
