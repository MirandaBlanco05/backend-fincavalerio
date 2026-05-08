const express = require("express");
const router = express.Router();

const { getDashboardVentas }       = require("./CONTROLLER/dashventa.controller");
const { getDashboardCompras }      = require("./CONTROLLER/dashcompra.controller");
const { getDashboardReproduccion } = require("./CONTROLLER/dashreproduccion.controller");
const { getDashboardSalud }        = require("./CONTROLLER/dashsalud.controller");
const { getDashboardAnimales }     = require("./CONTROLLER/dashbovino.controller");
const { getDashboardOrdeno }     = require("./CONTROLLER/dashordenio.controller");

router.get("/ventas",       getDashboardVentas);
router.get("/compras",      getDashboardCompras);
router.get("/reproduccion", getDashboardReproduccion);
router.get("/salud",        getDashboardSalud);
router.get("/animales",     getDashboardAnimales);
router.get("/ordeno",       getDashboardOrdeno);

module.exports = router;