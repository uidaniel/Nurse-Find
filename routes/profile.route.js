const express = require("express");
const { getNurseProfile } = require("../controllers/profile.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

const router = express.Router();
router.get("/nurse/profile", protect, getNurseProfile);

module.exports = router;
