const { sequelize } = require("../../../CORE/DATABASE/sequelize");
const { DataTypes } = require("sequelize");

const Bovino = require("../../BOVINO/MODEL/bovino.model");
const Ciclo = require("./celo.model");

// 🔗 CICLO ↔ BOVINO
Ciclo.belongsTo(Bovino, {
  foreignKey: "Id_bovino",
  as: "bovino"
});

Bovino.hasMany(Ciclo, {
  foreignKey: "Id_bovino",
  as: "ciclos"
});

