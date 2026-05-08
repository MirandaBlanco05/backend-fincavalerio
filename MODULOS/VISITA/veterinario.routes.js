const express = require("express");
const router = express.Router();
const controller = require("./CONTROLLER/veterinario.controller");

router.get("/listar", controller.listar);
router.get("/buscar/:id", controller.obtenerPorId);
router.post("/crear", controller.crear);
router.put("/update/:id", controller.actualizar);
router.delete("/eliminar/:id", controller.eliminar);

module.exports = router;
