// MODULOS/PARTO/MODEL/index.js
const Parto        = require("./parto.model");
const Embarazo     = require("../../EMBARAZO/MODEL/embarazo.model");
const Inseminacion = require("../../INSEMINACION/MODEL/inseminacion.model");
const Ciclo        = require("../../REPRODUCCION/MODEL/celo.model");
const Bovino       = require("../../BOVINO/MODEL/bovino.model");
 
// 🔗 PARTO ↔ EMBARAZO
// Solo definimos las relaciones de PARTO. Las de Embarazo, Inseminacion, etc. 
// ya se definen en sus propios archivos de modelo.
if (!Parto.associations.EMBARAZO) {
  Parto.belongsTo(Embarazo, { foreignKey: "id_embarazo", as: "EMBARAZO" });
}
if (!Embarazo.associations.PARTOS) {
  Embarazo.hasMany(Parto, { foreignKey: "id_embarazo", as: "PARTOS" });
}
 
module.exports = { Parto, Embarazo, Inseminacion, Ciclo, Bovino };