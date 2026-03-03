const express = require("express");
const router = express.Router();
const loginController = require("./CONTROLLER/login.controller");

router.post("/", loginController.login);

module.exports = router;
