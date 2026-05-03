const Cliente   = require("./cliente.model");
const Provincia = require("../../DIRECCION/PROVINCIA/MODEL/provincia.model");

// CLIENTE ↔ PROVINCIA
Provincia.hasMany(Cliente,    { foreignKey: "id_provincia", as: "clientes" });
Cliente.belongsTo(Provincia,  { foreignKey: "id_provincia", as: "provincia" });

console.log("RELACIONES DE CLIENTE CARGADAS");

module.exports = { Cliente, Provincia };