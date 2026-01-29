const express = require("express");
const router = express.Router();
const controller = require("./CONTROLLER/visita.controller");

router.get("/visita", controller.listar);

router.post("/agendar", controller.crear);

router.get("/:id", controller.obtenerPorId);

router.delete("/:id", controller.eliminar);

module.exports = router;
