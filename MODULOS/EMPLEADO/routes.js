// MODULOS/EMPLEADO/routes.js
const express = require("express");
const router  = express.Router();
const empleadoController = require("./CONTROLLER/empleado.controller");

router.post("/crear",      empleadoController.crear);

router.get("/listar",       empleadoController.listar);

router.get("/buscar/:id",    empleadoController.obtenerPorId);

router.put("/update/:id",    empleadoController.actualizar);

router.delete("/eliminar/:id", empleadoController.eliminar);

module.exports = router;