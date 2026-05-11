// MODULOS/PARTO/MODEL/index.js
const Parto        = require("./parto.model");
const Embarazo     = require("../../EMBARAZO/MODEL/embarazo.model");
const Inseminacion = require("../../INSEMINACION/MODEL/inseminacion.model");
const Ciclo        = require("../../REPRODUCCION/MODEL/celo.model");
const Bovino       = require("../../BOVINO/MODEL/bovino.model");
 
// 🔗 PARTO ↔ EMBARAZO
Parto.belongsTo(Embarazo, { foreignKey: "id_embarazo", as: "EMBARAZO" });
Embarazo.hasMany(Parto,   { foreignKey: "id_embarazo", as: "PARTOS" });

// 🔗 EMBARAZO ↔ INSEMINACION
Embarazo.belongsTo(Inseminacion, { foreignKey: "id_inseminacion", as: "INSEMINACION" });
Inseminacion.hasMany(Embarazo,   { foreignKey: "id_inseminacion", as: "EMBARAZOS" });

// 🔗 INSEMINACION ↔ CICLO
Inseminacion.belongsTo(Ciclo, { foreignKey: "id_ciclo", as: "ciclo" });
Ciclo.hasMany(Inseminacion,   { foreignKey: "id_ciclo", as: "inseminaciones" });

// 🔗 CICLO ↔ BOVINO
Ciclo.belongsTo(Bovino, { foreignKey: "id_bovino", as: "bovino" });
Bovino.hasMany(Ciclo,   { foreignKey: "id_bovino", as: "ciclos" });
 
module.exports = { Parto, Embarazo, Inseminacion, Ciclo, Bovino };