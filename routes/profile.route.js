const express = require("express");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profile.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

const router = express.Router();
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
