const express = require("express");
const router = express.Router();

const {
  addNurseService,
  removeNurseService,
} = require("../controllers/nurse.service.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

router.post("/add-nurse-service", protect, addNurseService);
router.post("/remove-nurse-service", protect, removeNurseService);

module.exports = router;
