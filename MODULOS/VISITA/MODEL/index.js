const { sequelize } = require("../../../CORE/DATABASE/sequelize");
const { DataTypes } = require("sequelize");

const Veterinario = require("./veterinario.model");
const Visita = require("./visita.model");
const Motivo = require("./motivo.model");
const MotivoVisita = require("./motivoVisita.model");

const Bovino = require("../../BOVINO/MODEL/bovino.model");

// VISITA ↔ VETERINARIO
Veterinario.hasMany(Visita, { foreignKey: "Id_veterinario" });
Visita.belongsTo(Veterinario, { foreignKey: "Id_veterinario" });

// VISITA ↔ BOVINO
Bovino.hasMany(Visita, { foreignKey: "Id_bovino" });
Visita.belongsTo(Bovino, { foreignKey: "Id_bovino" });

// VISITA ↔ MOTIVO (N:M)
Visita.belongsToMany(Motivo, {
  through: MotivoVisita,
  foreignKey: "Id_visita",
  otherKey: "Id_motivo",
  as: "Motivos"
});

Motivo.belongsToMany(Visita, {
  through: MotivoVisita,
  foreignKey: "Id_motivo",
  otherKey: "Id_visita",
  as: "Visitas"
});

console.log("RELACIONES DE VISITA CARGADAS");

module.exports = {
  Veterinario,
  Visita,
  Motivo,
  MotivoVisita
};
