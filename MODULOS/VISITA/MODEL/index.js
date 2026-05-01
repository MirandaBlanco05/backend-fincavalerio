const { sequelize } = require("../../../CORE/DATABASE/sequelize");
const { DataTypes } = require("sequelize");

const Veterinario = require("./veterinario.model");
const Visita = require("./visita.model");
const Motivo = require("./motivo.model");
const MotivoVisita = require("./motivoVisita.model");

const Bovino = require("../../BOVINO/MODEL/bovino.model");

// VISITA ↔ VETERINARIO
Veterinario.hasMany(Visita, { foreignKey: "id_veterinario" });
Visita.belongsTo(Veterinario, { foreignKey: "id_veterinario" });

// VISITA ↔ BOVINO
Bovino.hasMany(Visita, { foreignKey: "id_bovino" });
Visita.belongsTo(Bovino, { foreignKey: "id_bovino" });

// VISITA ↔ MOTIVO (N:M)
Visita.belongsToMany(Motivo, {
  through: MotivoVisita,
  foreignKey: "id_visita",
  otherKey: "id_motivo",
  as: "Motivos"
});

Motivo.belongsToMany(Visita, {
  through: MotivoVisita,
  foreignKey: "id_motivo",
  otherKey: "id_visita",
  as: "Visitas"
});

console.log("RELACIONES DE VISITA CARGADAS");

module.exports = {
  Veterinario,
  Visita,
  Motivo,
  MotivoVisita
};
