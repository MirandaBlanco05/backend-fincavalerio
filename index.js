const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { conectarDB } = require("./CORE/DATABASE/sequelize");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ====================
// Cargar modelos
// ====================
require("./MODULOS/VISITA/MODEL");
require("./MODULOS/BOVINO/MODEL");
require("./MODULOS/REPRODUCCION/MODEL/index.js");
require("./MODULOS/INSEMINACION/MODEL/index.js");
require("./MODULOS/EMBARAZO/MODEL");
require("./MODULOS/EMPLEADO/MODEL");
require("./MODULOS/PRODUCTO/MODEL");
require("./MODULOS/LOGIN/MODEL/login.model");

// ====================
// Conexion DB
// ====================
conectarDB();

// ====================
// Ruta test
// ====================
app.get("/api/test", (req, res) => {
  res.json({
    mensaje: "Backend conectado correctamente",
    estado: true
  });
});

// ====================
// Rutas API
// ====================
app.use("/api/visita", require("./MODULOS/VISITA/routes"));
app.use("/api/bovino", require("./MODULOS/BOVINO/routes"));
app.use("/api/login", require("./MODULOS/LOGIN/routes"));
app.use("/api/ciclo", require("./MODULOS/REPRODUCCION/routes"));
app.use("/api/inseminacion", require("./MODULOS/INSEMINACION/routes"));
app.use("/api/embarazo", require("./MODULOS/EMBARAZO/routes"));
app.use("/api/parto", require("./MODULOS/PARTO/routes"));
app.use("/api/empleado", require("./MODULOS/EMPLEADO/routes"));
app.use("/api/ordenio", require("./MODULOS/ORDENIO/routes"));
app.use("/api/producto", require("./MODULOS/PRODUCTO/routes"));

// ====================
// Puerto servidor
// ====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🟢 Backend en http://localhost:${PORT}`);
});