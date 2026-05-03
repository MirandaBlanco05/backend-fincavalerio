const express = require("express");
const router = express.Router();
const ctrl = require("./CONTROLLER/pais.controller");
 
router.get("/listar",       ctrl.listar);
router.get("/:id",    ctrl.obtener);

module.exports = router;
 