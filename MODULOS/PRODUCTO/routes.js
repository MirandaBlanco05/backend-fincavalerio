const express = require("express");
const router = express.Router();
const ctrl = require("./CONTROLLER/producto.controller");

router.get("/listar", ctrl.listar);
router.post("/crear", ctrl.crear);
router.put("/update/:id", ctrl.actualizar);
router.delete("/eliminar/:id", ctrl.eliminar);

module.exports = router;