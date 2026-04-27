const Bovino = require("../../BOVINO/MODEL/bovino.model");
const Ciclo = require("../../REPRODUCCION/MODEL/celo.model");
const Veterinario = require("../../VISITA/MODEL/veterinario.model");
const Inseminacion = require("../MODEL/inseminacion.model");


// 🔗 INSEMINACION ↔ CICLO
Inseminacion.belongsTo(Ciclo, { foreignKey: "Id_ciclo", as: "ciclo" });
Ciclo.hasMany(Inseminacion, { foreignKey: "Id_ciclo", as: "inseminaciones" });

// 🔗 INSEMINACION ↔ VETERINARIO
Inseminacion.belongsTo(Veterinario, { foreignKey: "Id_veterinaro", as: "veterinario" });
Veterinario.hasMany(Inseminacion, { foreignKey: "Id_veterinaro", as: "inseminaciones" });