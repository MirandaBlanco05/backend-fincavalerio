const express = require("express");
const router = express.Router();
const controller = require("./CONTROLLER/celo.controller");

//ciclo celo
router.post("/crear", controller.crearCiclo);
router.get("/listar", controller.obtenerCiclos);
router.get("/:id", controller.obtenerCicloPorId);
router.put("/update/:id", controller.actualizarCiclo);
router.delete("/delete/:id", controller.eliminarCiclo);

module.exports = router;
