const express = require("express");
const router = express.Router();

const {
  registerUser,
} = require("../controllers/user.controller/register.user.controller.js");
const {
  registerNurse,
} = require("../controllers/nurse.controller/register.nurse.controller.js");
const {
  login,
} = require("../controllers/user.controller/login.user.controller.js");
const {
  loginNurse,
} = require("../controllers/nurse.controller/login.nurse.controller.js");

router.post("/user/register", registerUser);
router.post("/nurse/register", registerNurse);
router.post("/user/login", login);
router.post("/nurse/login", loginNurse);
module.exports = router;
