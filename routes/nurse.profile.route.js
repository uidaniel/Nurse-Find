const express = require("express");
const {
  completeProfile,
} = require("../controllers/nurse.controller/nurse.profile.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/nurse/complete-profile", protect, completeProfile);

module.exports = router;
