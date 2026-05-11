const { sequelize } = require("../../../CORE/DATABASE/sequelize");
const { DataTypes } = require("sequelize");

const Veterinario = require("./veterinario.model");
const Visita = require("./visita.model");
const Motivo = require("./motivo.model");
const MotivoVisita = require("./motivovisita.model");

const Bovino = require("../../BOVINO/MODEL/bovino.model");

// VISITA ↔ VETERINARIO
Veterinario.hasMany(Visita, { foreignKey: "id_veterinario", as: "VISITAS_VET" });
Visita.belongsTo(Veterinario, { foreignKey: "id_veterinario", as: "VETERINARIO" });

// VISITA ↔ BOVINO
Bovino.hasMany(Visita, { foreignKey: "id_bovino", as: "VISITAS_BOV" });
Visita.belongsTo(Bovino, { foreignKey: "id_bovino", as: "BOVINO" });

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
