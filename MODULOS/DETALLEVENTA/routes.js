const express = require("express");
const router  = express.Router();
const ctrl    = require("./CONTROLLER/detalle_venta.controller");

router.get("/venta/:id_venta",    ctrl.listarPorVenta);
router.post("/crear",                  ctrl.crear);
router.put("/update/venta/:id_venta",    ctrl.actualizar);
router.patch("/desactivar/:id_venta", ctrl.desactivar);

module.exports = router;