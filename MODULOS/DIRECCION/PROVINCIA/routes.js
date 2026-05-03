// MODULOS/DIRECCION/PROVINCIA/routes.js
const express = require("express");
const router  = express.Router();
const ctrl    = require("./CONTROLLER/provincia.controller");

router.get("/listar",       ctrl.listar);
router.get("/obtener/:id",    ctrl.obtener);
router.post("/crear",      ctrl.crear);


module.exports = router;