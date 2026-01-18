const express = require("express");
const router = express.Router();

const {
  search,
  getPopularSearches,
} = require("../controllers/search.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

router.get("/search/:query", protect, search);
router.get("/popular", protect, getPopularSearches);

module.exports = router;
