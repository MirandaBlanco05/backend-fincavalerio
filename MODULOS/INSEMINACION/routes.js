
const express = require("express");
const router = express.Router();
const controller = require("./CONTROLLER/inseminacion.controller");

// 🔹 Obtener todos
router.get("/listar", controller.obtenerInseminaciones);

// 🔹 Obtener por ID
router.get("/listar/:id", controller.obtenerInseminacionPorId);

// 🔹 Crear
router.post("/crear", controller.crearInseminacion);

// 🔹 Actualizar
router.put("/actualizar/:id", controller.actualizarInseminacion);

// 🔹 Eliminar
router.delete("/eliminar/:id", controller.eliminarInseminacion);

module.exports = router;