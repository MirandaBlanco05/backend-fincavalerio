
// MODULOS/PARTO/MODEL/index.js
const Parto    = require("./parto.model");
const Embarazo = require("../../EMBARAZO/MODEL/embarazo.model");
 
// Relaciones
Parto.belongsTo(Embarazo, { foreignKey: "Id_embarazo", as: "EMBARAZO" });
Embarazo.hasMany(Parto,   { foreignKey: "Id_embarazo", as: "PARTOS" });
 
module.exports = { Parto, Embarazo };
 