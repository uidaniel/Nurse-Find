const express = require("express");
const router = express.Router();

const { register } = require("../controllers/register.controller.js");
const { login } = require("../controllers/login.controller.js");

router.post("/register", register);
router.post("/login", login);
module.exports = router;
