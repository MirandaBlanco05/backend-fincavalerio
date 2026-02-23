const express = require("express");
const router = express.Router();
const controllerin = require("./CONTROLLER/inseminacion.controller");

router.post("/crear", controllerin.crearInseminacion);
router.get("/listar", controllerin.obtenerInseminaciones);
router.get("/:id", controllerin.obtenerPorId);
router.delete("/:id", controllerin.eliminarInseminacion);
router.put("/:id", controllerin.actualizarInseminacion);

module.exports = router;
