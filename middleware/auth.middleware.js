const User = require("../models/user.model.js");
const supabase = require("../supabase.js");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      status: 400,
      message: "Not authorized",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(400).json({
        status: 400,
        message: "Invalid or expired token",
      });
    }
    const email = data.user.email;
    const user = await User.findOne({ email });
    req.user = { ...data.user, id: user._id };
    next();
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: "Authentication failed",
    });
  }
};

module.exports = { protect };
