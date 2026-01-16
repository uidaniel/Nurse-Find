const express = require("express");
const router = express.Router();
const {
  createOffer,
  editOffer,
  getOffer,
  deleteOffer,
} = require("../controllers/nurse.offer.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

router.post("/add", protect, createOffer);
router.put("/:id", protect, editOffer);
router.get("/:id", protect, getOffer);
router.delete("/delete/:id", protect, deleteOffer);

module.exports = router;
