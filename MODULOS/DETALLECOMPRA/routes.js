const express = require("express");
const router  = express.Router();
const ctrl    = require("./CONTROLLER/detallecompra.controller");

router.get("/compra/listar/:id_compra",          ctrl.listarPorCompra);
router.post("/crear",                          ctrl.crear);
router.put("/compra/update/:id_compra",          ctrl.actualizar);
router.patch("/desactivar/:id_compra",    ctrl.desactivar);

module.exports = router;