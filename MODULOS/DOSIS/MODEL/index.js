const Dosis       = require("./dosis.model");
const Tratamiento = require("../../TRATAMIENTO/MODEL/tratamiento.model");
const Insumo      = require("../../INSUMO/MODEL/insumo.model");

Tratamiento.hasMany(Dosis,    { foreignKey: "id_tratamiento", as: "dosis" });
Dosis.belongsTo(Tratamiento,  { foreignKey: "id_tratamiento", as: "tratamiento" });

Insumo.hasMany(Dosis,         { foreignKey: "id_insumo", as: "dosis" });
Dosis.belongsTo(Insumo,       { foreignKey: "id_insumo", as: "insumo" });

console.log("RELACIONES DE DOSIS CARGADAS");

module.exports = { Dosis, Tratamiento, Insumo };