const Historial           = require("./historial.model");
const HistorialEnfermedad = require("./historialenfermedad.model");
const Enfermedad          = require("../../ENFERMEDAD/MODEL/enfermedad.model");
const { Bovino }          = require("../../BOVINO/MODEL");

Bovino.hasMany(Historial,    { foreignKey: "id_bovino", as: "historiales" });
Historial.belongsTo(Bovino,  { foreignKey: "id_bovino", as: "bovino" });

Historial.belongsToMany(Enfermedad, {
  through: HistorialEnfermedad,
  foreignKey: "id_historial",
  otherKey:   "id_enfermedad",
  as: "enfermedades"
});

Enfermedad.belongsToMany(Historial, {
  through: HistorialEnfermedad,
  foreignKey: "id_enfermedad",
  otherKey:   "id_historial",
  as: "historiales"
});

console.log("RELACIONES DE HISTORIAL CARGADAS");

module.exports = { Historial, HistorialEnfermedad, Enfermedad, Bovino };