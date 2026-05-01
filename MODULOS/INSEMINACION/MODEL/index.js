const Bovino = require("../../BOVINO/MODEL/bovino.model");
const Ciclo = require("../../REPRODUCCION/MODEL/celo.model");
const Veterinario = require("../../VISITA/MODEL/veterinario.model");
const Inseminacion = require("../MODEL/inseminacion.model");


// 🔗 INSEMINACION ↔ CICLO
Inseminacion.belongsTo(Ciclo, { foreignKey: "id_ciclo", as: "ciclo" });
Ciclo.hasMany(Inseminacion, { foreignKey: "id_ciclo", as: "inseminaciones" });

// 🔗 INSEMINACION ↔ VETERINARIO
Inseminacion.belongsTo(Veterinario, { foreignKey: "id_veterinario", as: "veterinario" });
Veterinario.hasMany(Inseminacion, { foreignKey: "id_veterinario", as: "inseminaciones" });