// MODULOS/ORDENIO/MODEL/index.js
const Ordenio = require("./ordenio.model");
const Bovino  = require("../../BOVINO/MODEL/bovino.model");
const Empleado = require("../../EMPLEADO/MODEL/empleado.model");

// ── Relación: un Bovino tiene muchos Ordenos ──────────────────────────────────
Bovino.hasMany(Ordenio,  { foreignKey: "id_bovino",  as: "ORDENIOS_BOVINO" });
Ordenio.belongsTo(Bovino, { foreignKey: "id_bovino",  as: "bovino"  });
Empleado.hasMany(Ordenio,   { foreignKey: "id_empleado", as: "ORDENIOS_EMPLEADO"  });
Ordenio.belongsTo(Empleado, { foreignKey: "id_empleado", as: "encargado" });

module.exports = { Ordenio, Bovino,Empleado };