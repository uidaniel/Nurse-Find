const express = require("express");
const router = express.Router();
const {
  addService,
  editService,
  deleteService,
  getServices,
} = require("../controllers/service.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

router.get("/", protect, getServices);
router.post("/add", protect, addService);
router.put("/edit/:id", protect, editService);
router.delete("/delete/:id", protect, deleteService);

module.exports = router;
