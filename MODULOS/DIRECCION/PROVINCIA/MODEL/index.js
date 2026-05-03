const Pais      = require("../../PAIS/MODEL/pais.model");
const Provincia = require("./provincia.model");

Pais.hasMany(Provincia,   { foreignKey: "id_pais", as: "provincias" });
Provincia.belongsTo(Pais, { foreignKey: "id_pais", as: "pais" });

console.log("RELACIONES DE DIRECCION CARGADAS");

module.exports = { Pais, Provincia };