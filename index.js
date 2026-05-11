const express = require("express"); // Redeploy: 2026-05-11 14:39
const cors = require("cors");
require("dotenv").config();

// Soporte para serializar BigInt en JSON (necesario para numero_crotal)
BigInt.prototype.toJSON = function() { return this.toString() }

const { conectarDB, sequelize } = require("./CORE/DATABASE/sequelize"); 
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

const iniciar = async () => {
  try {
    await conectarDB();
    // await sequelize.sync({ alter: true }); // Desactivado para evitar bloqueos
    console.log("✅ Base de datos conectada (Sincronización manual)");

  } catch (error) {
    console.error("❌ Error:", error);
  }
};

iniciar();

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
app.use("/api/veterinario", require("./MODULOS/VISITA/veterinario.routes"));
app.use("/api/grupo", require("./MODULOS/BOVINO/grupo.routes"));
app.use("/api/raza", require("./MODULOS/BOVINO/raza.routes"));
app.use("/api/bovino", require("./MODULOS/BOVINO/routes"));
app.use("/api/login", require("./MODULOS/LOGIN/routes"));
app.use("/api/ciclo", require("./MODULOS/REPRODUCCION/routes"));
app.use("/api/inseminacion", require("./MODULOS/INSEMINACION/routes"));
app.use("/api/embarazo", require("./MODULOS/EMBARAZO/routes"));
app.use("/api/parto", require("./MODULOS/PARTO/routes"));
app.use("/api/empleado", require("./MODULOS/EMPLEADO/routes"));
app.use("/api/ordenio", require("./MODULOS/ORDENIO/routes"));
app.use("/api/producto", require("./MODULOS/PRODUCTO/routes"));
app.use("/api/pais", require("./MODULOS/DIRECCION/PAIS/routes"));
app.use("/api/provincia", require("./MODULOS/DIRECCION/PROVINCIA/routes"));
app.use("/api/cliente", require("./MODULOS/CLIENTE/routes"));
app.use("/api/ncf", require("./MODULOS/COMPROBANTE/routes"));
app.use("/api/venta", require("./MODULOS/VENTA/routes"));
app.use("/api/metodo-pago", require("./MODULOS/METODOPAGO/routes"));
app.use("/api/detalleVenta", require("./MODULOS/DETALLEVENTA/routes.js"));
app.use("/api/proveedor", require("./MODULOS/PROVEEDOR/routes"));
app.use("/api/insumo", require("./MODULOS/INSUMO/routes"));
app.use("/api/compra", require("./MODULOS/COMPRA/routes"));
app.use("/api/detalleCompra", require("./MODULOS/DETALLECOMPRA/routes"));
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

app.listen(PORT, () => {
  console.log(`🟢 Backend en http://localhost:${PORT}`);
});