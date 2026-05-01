const Embarazo = require("./embarazo.model");
const Veterinario = require("../../VISITA/MODEL/veterinario.model");
const Inseminacion = require("../../INSEMINACION/MODEL/inseminacion.model");
 

Embarazo.belongsTo(Veterinario, { foreignKey: "id_veterinario", as: "VETERINARIO" });
Embarazo.belongsTo(Inseminacion, { foreignKey: "id_inseminacion", as: "INSEMINACION" });
 
module.exports = { Embarazo, Veterinario, Inseminacion };