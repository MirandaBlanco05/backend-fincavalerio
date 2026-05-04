const express = require("express");
const router = express.Router();
const controller = require("./CONTROLLER/insumo.controller");

router.get("/listar",       controller.listar);
router.get("/:id",    controller.obtener);
router.post("/crear",      controller.crear);
router.put("/update/:id",    controller.actualizar);
router.delete("/eliminar/:id", controller.eliminar);

module.exports = router;