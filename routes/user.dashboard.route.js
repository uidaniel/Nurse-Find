const express = require("express");
const router = express.Router();
const {
  getUserDashboardDetails,
} = require("../controllers/user.controller/user.dashboard.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

router.get("/user/dashboard", protect, getUserDashboardDetails);

module.exports = router;
