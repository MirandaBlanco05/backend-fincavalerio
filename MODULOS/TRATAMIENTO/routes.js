const express = require("express");
const router  = express.Router();
const ctrl    = require("./CONTROLLER/tratamiento.controller");

router.get("/listar",                             ctrl.listar);
router.get("/:id",                          ctrl.obtener);
router.get("/enfermedad/:id_enfermedad",    ctrl.listarPorEnfermedad);
router.post("/crear",                            ctrl.crear);
router.put("/update/:id",                          ctrl.actualizar);
router.delete("/eliminar/:id",                       ctrl.eliminar);

module.exports = router;