
const { sequelize } = require('./CORE/DATABASE/sequelize');
// Importar todos los modelos para que Sequelize los conozca
require("./MODULOS/VISITA/MODEL");
require("./MODULOS/BOVINO/MODEL");
require("./MODULOS/REPRODUCCION/MODEL/index.js");
require("./MODULOS/INSEMINACION/MODEL/index.js");
require("./MODULOS/EMBARAZO/MODEL");
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

async function sync() {
  try {
    console.log("🚀 Iniciando sincronización total (ALTER)...");
    await sequelize.sync({ alter: true });
    console.log("✅ Sincronización completada.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en sincronización:", err);
    process.exit(1);
  }
}

sync();
