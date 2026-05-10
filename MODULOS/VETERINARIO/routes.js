const express = require("express");
const router = express.Router();
const controller = require("./CONTROLLER/veterinario.controller");

router.post("/crear", controller.crear);
router.get("/listar", controller.listar);
router.get("/:id", controller.obtenerPorId);
router.put("/update/:id", controller.actualizar);
router.delete("/eliminar/:id", controller.eliminar);

module.exports = router;