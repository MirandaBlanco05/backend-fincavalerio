const express = require("express");
const router = express.Router();
const controller = require("./CONTROLLER/visita.controller");

router.get("/listar", controller.listar);
router.get("/motivos", controller.listarMotivos);

router.post("/crear", controller.crear);
router.get("/:id", controller.obtenerPorId);
router.put("/update/:id", controller.actualizar);
router.delete("/eliminar/:id", controller.eliminar);

module.exports = router;
