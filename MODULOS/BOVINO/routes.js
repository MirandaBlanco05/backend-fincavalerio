const express = require("express");
const router = express.Router();

const bovinoController = require("./CONTROLLER/bovino.controller");

router.post("/crear", bovinoController.crear);
router.get("/listar", bovinoController.listar);
router.delete("/eliminar/:id", bovinoController.eliminar);
router.put("/update/:id", bovinoController.actualizar);



module.exports = router;
