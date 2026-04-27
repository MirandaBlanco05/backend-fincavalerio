const Embarazo = require("./embarazo.model");
const Veterinario = require("../../VISITA/MODEL/veterinario.model");
const Inseminacion = require("../../INSEMINACION/MODEL/inseminacion.model");
 

Embarazo.belongsTo(Veterinario, { foreignKey: "Id_veterinario", as: "VETERINARIO" });
Embarazo.belongsTo(Inseminacion, { foreignKey: "Id_inseminacion", as: "INSEMINACION" });
 
module.exports = { Embarazo, Veterinario, Inseminacion };