// MODULOS/EMPLEADO/MODEL/index.js
const Empleado = require("./empleado.model");
const Ordenio  = require("../../ORDENIO/MODEL/ordenio.model");
 
// ── Un Empleado puede tener muchos Ordeños ────────────────────────────────────
Empleado.hasMany(Ordenio,   { foreignKey: "Id_empleado", as: "ORDENOS"  });
Ordenio.belongsTo(Empleado, { foreignKey: "Id_empleado", as: "EMPLEADO" });
 
module.exports = { Empleado, Ordenio };
 