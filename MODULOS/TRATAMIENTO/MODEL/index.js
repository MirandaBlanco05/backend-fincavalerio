const Tratamiento = require("./tratamiento.model");
const Enfermedad  = require("../../ENFERMEDAD/MODEL/enfermedad.model");
const Empleado    = require("../../EMPLEADO/MODEL/empleado.model");
const Bovino      = require("../../BOVINO/MODEL/bovino.model");

// TRATAMIENTO ↔ ENFERMEDAD
Enfermedad.hasMany(Tratamiento,   { foreignKey: "id_enfermedad", as: "tratamientos" });
Tratamiento.belongsTo(Enfermedad, { foreignKey: "id_enfermedad", as: "enfermedad" });

// TRATAMIENTO ↔ EMPLEADO
Empleado.hasMany(Tratamiento,     { foreignKey: "id_empleado", as: "tratamientos" });
Tratamiento.belongsTo(Empleado,   { foreignKey: "id_empleado", as: "empleado" });

// TRATAMIENTO ↔ BOVINO
Bovino.hasMany(Tratamiento,       { foreignKey: "id_bovino", as: "tratamientos" });
Tratamiento.belongsTo(Bovino,     { foreignKey: "id_bovino", as: "bovino" });

console.log("RELACIONES DE TRATAMIENTO CARGADAS");

module.exports = { Tratamiento, Enfermedad, Empleado, Bovino };