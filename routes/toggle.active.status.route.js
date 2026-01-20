const express = require("express");
const router = express.Router();
const {
  toggleActiveStatus,
} = require("../controllers/nurse.controller/toggle.active.status.controlller");
const { protect } = require("../middleware/auth.middleware");

router.post("/nurse/toggle-active-status", protect, toggleActiveStatus);

module.exports = router;
