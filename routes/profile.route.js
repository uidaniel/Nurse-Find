const express = require("express");
const { getProfile } = require("../controllers/profile.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

const router = express.Router();
router.get("/profile", protect, getProfile);

module.exports = router;
