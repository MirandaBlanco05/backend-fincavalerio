const express    = require("express");
const router     = express.Router();
const compCtrl   = require("./CONTROLLER/comprobante.controller");
const secCtrl    = require("./CONTROLLER/secuencia.controller");

// ── COMPROBANTE FISCAL ──
router.get("/comprobante/listar",        compCtrl.listar);
router.get("/comprobante/:id",    compCtrl.obtener);
router.post("/comprobante/crear",       compCtrl.crear);
router.put("/comprobante/update/:id",    compCtrl.actualizar);
router.delete("/comprobante/eliminar/:id", compCtrl.eliminar);

// ── SECUENCIA NCF ──
router.get("/secuencia/listar",          secCtrl.listar);
router.get("/secuencia/:id",      secCtrl.obtener);
router.post("/secuencia/crear",         secCtrl.crear);
router.put("/secuencia/actualizar/:id",      secCtrl.actualizar);
router.delete("/secuencia/:id",   secCtrl.eliminar);

module.exports = router;