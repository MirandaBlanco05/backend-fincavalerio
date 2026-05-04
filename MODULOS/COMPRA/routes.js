const express = require("express");
const router  = express.Router();
const controller = require("./CONTROLLER/compra.controller");

router.get("/listar",       controller.listar);
router.get("/:id",    controller.obtener);
router.post("/crear",      controller.crear);
router.put("/update/:id",    controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;