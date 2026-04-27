const express = require("express");
const router = express.Router();
const controller = require("./CONTROLLER/cliente.controller");

router.get("/listar", controller.obtenerClientes);
router.get("/listar/:id", controller.obtenerClientePorId);
router.post("/crear", controller.crearCliente);
router.put("/update/:id", controller.actualizarCliente);
router.delete("/eliminar/:id", controller.eliminarCliente);

module.exports = router;