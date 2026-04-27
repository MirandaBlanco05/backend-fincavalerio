// MODULOS/EMPLEADO/routes.js
const express = require("express");
const router  = express.Router();
const empleadoController = require("./CONTROLLER/empleado.controller");

// POST   /api/empleado/     → Crear
router.post("/",      empleadoController.crear);

// GET    /api/empleado/     → Listar todos
router.get("/",       empleadoController.listar);

// GET    /api/empleado/:id  → Obtener uno por ID
router.get("/:id",    empleadoController.obtenerPorId);

// PUT    /api/empleado/:id  → Actualizar
router.put("/:id",    empleadoController.actualizar);

// DELETE /api/empleado/:id  → Eliminar
router.delete("/:id", empleadoController.eliminar);

module.exports = router;