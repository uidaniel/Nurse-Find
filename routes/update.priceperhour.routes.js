const express = require("express");
const router = express.Router();

const {
  updatePricePerHour,
} = require("../controllers/update.priceperhour.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

router.put("/profile/update-pph", protect, updatePricePerHour);
module.exports = router;
