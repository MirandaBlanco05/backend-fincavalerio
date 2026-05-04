const Proveedor  = require("./proveedor.model");
const Provincia = require("../../DIRECCION/PROVINCIA/MODEL/provincia.model");

Provincia.hasMany(Proveedor,    { foreignKey: "id_provincia", as: "Proveedor" });
Proveedor.belongsTo(Provincia,  { foreignKey: "id_provincia", as: "provincia" });

console.log("RELACIONES DE PROVEEDOR CARGADAS");

module.exports = { Proveedor, Provincia };