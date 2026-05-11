const express = require("express"); // Redeploy: 2026-05-11 14:39
const cors = require("cors");
require("dotenv").config();

const app = express();

// Aumentar límites para evitar errores de payload
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Configuración de CORS
app.use(cors());

// Manejo de BigInt para JSON
BigInt.prototype.toJSON = function() { return this.toString() }

// ====================
// Cargar modelos
// ====================
require("./MODULOS/VISITA/MODEL");
require("./MODULOS/BOVINO/MODEL");
require("./MODULOS/REPRODUCCION/MODEL/index.js");
require("./MODULOS/INSEMINACION/MODEL/index.js");
require("./MODULOS/EMBARAZO/MODEL");
require("./MODULOS/PARTO/MODEL");
require("./MODULOS/EMPLEADO/MODEL");
require("./MODULOS/PRODUCTO/MODEL");
require("./MODULOS/LOGIN/MODEL/login.model");
require("./MODULOS/DIRECCION/PROVINCIA/MODEL");
require("./MODULOS/CLIENTE/MODEL");
require("./MODULOS/COMPROBANTE/MODEL");
require("./MODULOS/VENTA/MODEL");
require("./MODULOS/METODOPAGO/MODEL");
require("./MODULOS/DETALLEVENTA/MODEL");
require("./MODULOS/PROVEEDOR/MODEL");
require("./MODULOS/INSUMO/MODEL");
require("./MODULOS/COMPRA/MODEL");
require("./MODULOS/DETALLECOMPRA/MODEL");
require("./MODULOS/ENFERMEDAD/MODEL");
require("./MODULOS/HISTORIAL/MODEL");
require("./MODULOS/TRATAMIENTO/MODEL");
require("./MODULOS/DOSIS/MODEL");
require("./MODULOS/VACUNA/MODEL");


// ====================
// Conexion DB
// ====================
const { conectarDB } = require("./CORE/DATABASE/sequelize");

const iniciar = async () => {
  try {
    await conectarDB();
    // await sequelize.sync({ alter: true }); // Desactivado para evitar bloqueos
    console.log("✅ Base de datos conectada (Sincronización manual)");

  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// iniciar(); // Movido


// ====================
// Ruta test
// ====================
app.get("/api/test", (req, res) => {
  res.json({ mensaje: "API Funcionando correctamente", status: "OK" });
});


// ====================
// Montar Rutas
// ====================
app.use("/api/login", require("./MODULOS/LOGIN/routes"));
app.use("/api/bovino", require("./MODULOS/BOVINO/routes"));
app.use("/api/grupo", require("./MODULOS/BOVINO/grupo.routes"));
app.use("/api/raza", require("./MODULOS/BOVINO/raza.routes"));
app.use("/api/inseminacion", require("./MODULOS/INSEMINACION/routes"));
app.use("/api/embarazo", require("./MODULOS/EMBARAZO/routes"));
app.use("/api/ciclo", require("./MODULOS/REPRODUCCION/routes"));
app.use("/api/parto", require("./MODULOS/PARTO/routes"));
app.use("/api/empleado", require("./MODULOS/EMPLEADO/routes"));
app.use("/api/producto", require("./MODULOS/PRODUCTO/routes"));
app.use("/api/provincia", require("./MODULOS/DIRECCION/PROVINCIA/routes"));
app.use("/api/cliente", require("./MODULOS/CLIENTE/routes"));
app.use("/api/comprobante", require("./MODULOS/COMPROBANTE/routes"));
app.use("/api/venta", require("./MODULOS/VENTA/routes"));
app.use("/api/metodopago", require("./MODULOS/METODOPAGO/routes"));
app.use("/api/detalleventa", require("./MODULOS/DETALLEVENTA/routes"));
app.use("/api/proveedor", require("./MODULOS/PROVEEDOR/routes"));
app.use("/api/insumo", require("./MODULOS/INSUMO/routes"));
app.use("/api/compra", require("./MODULOS/COMPRA/routes"));
app.use("/api/detallecompra", require("./MODULOS/DETALLECOMPRA/routes"));
app.use("/api/enfermedad", require("./MODULOS/ENFERMEDAD/routes"));
app.use("/api/historial", require("./MODULOS/HISTORIAL/routes"));
app.use("/api/tratamiento", require("./MODULOS/TRATAMIENTO/routes"));
app.use("/api/vacuna", require("./MODULOS/VACUNA/routes"));
app.use("/api/dosis", require("./MODULOS/DOSIS/routes"));

// ---- Routers de los 6 dashboards ----
app.use('/api/dashboard/ventas',       require('./MODULOS/DASHBOARD/routes.js'));
app.use('/api/dashboard/compras',      require('./MODULOS/DASHBOARD/routes.js'));
app.use('/api/dashboard/reproduccion', require('./MODULOS/DASHBOARD/routes.js'));
app.use('/api/dashboard/salud',        require('./MODULOS/DASHBOARD/routes.js'));
app.use('/api/dashboard/animales',     require('./MODULOS/DASHBOARD/routes.js'));
app.use('/api/dashboard/ordeno',       require('./MODULOS/DASHBOARD/routes.js'));

app.use("/api/veterinario", require("./MODULOS/VETERINARIO/routes"));

// ====================
// Puerto servidor
// ====================

const PORT = process.env.PORT || 3000;

app.get("/api/ping", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🟢 Servidor escuchando en puerto ${PORT}`);
  console.log("🚀 Iniciando conexión con base de datos...");
  iniciar();
});

module.exports = app;