const express = require("express");
const router = express.Router();
const controller = require("./CONTROLLER/visita.controller");

router.get("/listar", controller.listar);

router.post("/crear", controller.crear);

router.get("/:id", controller.obtenerPorId);

router.delete("/eliminar/:id", controller.eliminar);

router.put("/update/:id", controller.actualizar);

module.exports = router;
