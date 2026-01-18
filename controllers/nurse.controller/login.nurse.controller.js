const supabase = require("../../supabase.js");
const validateInput = require("../../functions/validate-input.functions.js");
const Nurse = require("../../models/nurse.model.js");
const jwt = require("jsonwebtoken");

const loginNurse = async (req, res) => {
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
      const nurse = await Nurse.findOne({ email });

      res.status(200).json({
        status: 200,
        message: "Nurse logged in successfully",
        token: data.session.access_token,
        nurse,
      });
    }
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = { loginNurse };
