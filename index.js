// @ts-nocheck
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./MODULOS/VISITA/MODEL");
require("./MODULOS/BOVINO/MODEL");


const { conectarDB } = require("./CORE/DATABASE/sequelize");

const app = express();

app.use(cors()); // 🔥 PERMITE FRONTEND
app.use(express.json());

conectarDB();

app.get("/api/test", (req, res) => {
  res.json({
    mensaje: "Backend conectado correctamente",
    estado: true
  });
});

app.use(express.json());
app.use("/api", require("./MODULOS/VISITA/routes"));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🟢 Backend en http://localhost:${PORT}`);
});

