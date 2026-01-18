const User = require("../models/user.model.js");
const Nurse = require("../models/nurse.model.js");
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
    console.log(data);
    const email = data.user.email;
    const role = data.user.user_metadata.role;

    let param;

    if (role == "nurse") {
      param = Nurse.findOne({ email }).select("+accountType");
    } else {
      param = User.findOne({ email });
    }

    const user = await param;
    console.log(user);
    if (role == "nurse") {
      req.user = {
        ...data.user,
        id: user._id,
        role: user.role,
        accountType: user.accountType,
      };
    } else {
      req.user = { ...data.user, id: user._id, role: user.role };
    }

    console.log(user);

    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = { protect };
