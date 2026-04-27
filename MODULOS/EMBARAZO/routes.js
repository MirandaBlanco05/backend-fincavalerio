// MODULOS/EMBARAZO/routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("./CONTROLLER/embarazo.controller");
 
router.post("/crear",ctrl.crear);
router.get("/listar", ctrl.listar);
router.get("/:id",ctrl.obtenerPorId);
router.put("/update/:id",ctrl.actualizar);
router.delete("/delete/:id",ctrl.eliminar);
 
module.exports = router;
 