// MODULOS/ORDENIO/routes.js
const express = require("express");
const router  = express.Router();
const ordenioController = require("./CONTROLLER/ordenio.controller");

router.post("/crear",        ordenioController.crear);

router.get("/listar",         ordenioController.listar);

router.get("/buscar/:id",      ordenioController.obtenerPorId);

router.put("/update/:id",      ordenioController.actualizar);

router.delete("/eliminar/:id",   ordenioController.eliminar);

module.exports = router;