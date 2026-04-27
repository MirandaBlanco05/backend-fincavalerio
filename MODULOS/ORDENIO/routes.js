// MODULOS/ORDENIO/routes.js
const express = require("express");
const router  = express.Router();
const ordenioController = require("./CONTROLLER/ordenio.controller");

// POST   /api/ordenio/       → Crear ordeño
router.post("/",        ordenioController.crear);

// GET    /api/ordenio/       → Listar todos
router.get("/",         ordenioController.listar);

// GET    /api/ordenio/:id    → Obtener uno por ID
router.get("/:id",      ordenioController.obtenerPorId);

// PUT    /api/ordenio/:id    → Actualizar
router.put("/:id",      ordenioController.actualizar);

// DELETE /api/ordenio/:id    → Eliminar
router.delete("/:id",   ordenioController.eliminar);

module.exports = router;