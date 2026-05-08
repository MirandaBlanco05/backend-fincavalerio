const express = require("express");
const router = express.Router();
const controller = require("./CONTROLLER/raza.controller");

router.get("/listar", controller.listar);

module.exports = router;
