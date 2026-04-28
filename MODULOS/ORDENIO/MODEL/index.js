// MODULOS/ORDENIO/MODEL/index.js
const Ordenio = require("./ordenio.model");
const Bovino  = require("../../BOVINO/MODEL/bovino.model");
const Empleado = require("../../EMPLEADO/MODEL/empleado.model");

// ── Relación: un Bovino tiene muchos Ordenos ──────────────────────────────────
Bovino.hasMany(Ordenio,  { foreignKey: "Id_bovino",  as: "ORDENIOS_BOVINO" });
Ordenio.belongsTo(Bovino, { foreignKey: "Id_bovino",  as: "BOVINO"  });
Empleado.hasMany(Ordenio,   { foreignKey: "Id_empleado", as: "ORDENIOS_EMPLEADO"  });
Ordenio.belongsTo(Empleado, { foreignKey: "Id_empleado", as: "EMPLEADO" });

module.exports = { Ordenio, Bovino,Empleado };