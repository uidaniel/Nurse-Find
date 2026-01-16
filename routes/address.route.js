const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware.js");

const {
  getAddresses,
  addAddress,
  updateAddress,
} = require("../controllers/address.controller.js");

router.get("/address", protect, getAddresses);
router.post("/address", protect, updateAddress);
router.post("/address/add", protect, addAddress);

module.exports = router;
