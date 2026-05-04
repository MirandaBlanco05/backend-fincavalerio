const express = require("express");
const router  = express.Router();
const ctrl    = require("./CONTROLLER/dosis.controller");

router.get("/listar",ctrl.listar);
router.get("/:id", ctrl.obtener);
router.get("/tratamiento/:id_tratamiento",ctrl.listarPorTratamiento);
router.post("/crear", ctrl.crear);
router.put("/update/:id",ctrl.actualizar);
router.delete("/actualizar/:id",ctrl.eliminar);

module.exports = router;