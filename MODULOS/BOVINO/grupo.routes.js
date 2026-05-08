const express = require("express");
const router = express.Router();
const controller = require("./CONTROLLER/grupo.controller");

router.get("/listar", controller.listar);

module.exports = router;
