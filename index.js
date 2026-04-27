
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./MODULOS/VISITA/MODEL");
require("./MODULOS/BOVINO/MODEL");


const { conectarDB } = require("./CORE/DATABASE/sequelize");

const app = express();

app.use(cors()); 
app.use(express.json());

conectarDB();

app.get("/api/test", (req, res) => {
  res.json({
    mensaje: "Backend conectado correctamente",
    estado: true
  });
});

//visita
app.use(express.json());
app.use("/api/visita", require("./MODULOS/VISITA/routes"));

//bovino
const bovinoRoutes = require("./MODULOS/BOVINO/routes");
app.use("/api/bovino", bovinoRoutes);

//login
app.use("/api/login", require("./MODULOS/LOGIN/routes"));


// Associations - load BEFORE routes
require("./MODULOS/REPRODUCCION/MODEL/index.js");

// ciclo celo
app.use("/api/ciclo", require("./MODULOS/REPRODUCCION/routes"));

//inseminacion 
require("./MODULOS//INSEMINACION/MODEL/index.js");
app.use("/api/inseminacion", require("./MODULOS/INSEMINACION/routes"));

 //embarazo
require("./MODULOS/EMBARAZO/MODEL");
app.use("/api/embarazo", require("./MODULOS/EMBARAZO/routes"));

// parto
app.use("/api/parto", require("./MODULOS/PARTO/routes"));       
const PORT = process.env.PORT || 3000;

require("./MODULOS/EMPLEADO/MODEL");
app.use("/api/empleado", require("./MODULOS/EMPLEADO/routes"));

app.use("/api/ordenio", require("./MODULOS/ORDENIO/routes"));  

app.listen(PORT, () => {
  console.log(`🟢 Backend en http://localhost:${PORT}`);
});

