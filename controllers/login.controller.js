const supabase = require("../supabase.js");
const validateInput = require("../functions/validate-input.functions.js");
const User = require("../models/user.model.js");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validated = validateInput(res, { email, password });
    if (!validated) return;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      res.status(401).json({
        status: 401,
        message: error.message,
      });
    }
    if (data.user) {
      const user = await User.findOne({ email });
      res.status(200).json({
        status: 200,
        message: "User logged in successfully",
        user,
      });
    }
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = { login };
