// MODULOS/PARTO/MODEL/index.js
const Parto        = require("./parto.model");
const Embarazo     = require("../../EMBARAZO/MODEL/embarazo.model");
const Inseminacion = require("../../INSEMINACION/MODEL/inseminacion.model");
const Ciclo        = require("../../REPRODUCCION/MODEL/celo.model");
const Bovino       = require("../../BOVINO/MODEL/bovino.model");
 
// Relaciones
Parto.belongsTo(Embarazo, { foreignKey: "id_embarazo", as: "EMBARAZO" });
Embarazo.hasMany(Parto,   { foreignKey: "id_embarazo", as: "PARTOS" });
 
module.exports = { Parto, Embarazo, Inseminacion, Ciclo, Bovino };