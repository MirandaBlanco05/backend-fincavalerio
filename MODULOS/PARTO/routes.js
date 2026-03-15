// MODULOS/PARTO/routes.js
const express = require("express");
const router  = express.Router();
const ctrl    = require("./CONTROLLER/parto.controller");
 
router.post("/crear",ctrl.crear);
router.get("/listar",ctrl.listar);
router.get("/:id",ctrl.obtenerPorId);
router.put("/actualizar/:id",    ctrl.actualizar);
router.delete("/eliminar/:id", ctrl.eliminar);
 
module.exports = router;
 