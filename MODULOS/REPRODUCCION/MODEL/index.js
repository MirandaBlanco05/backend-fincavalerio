const { sequelize } = require("../../../CORE/DATABASE/sequelize");
const { DataTypes } = require("sequelize");

const Bovino = require("../../BOVINO/MODEL/bovino.model");
const Ciclo = require("./celo.model");

//  CICLO ↔ BOVINO
Ciclo.belongsTo(Bovino, {
  foreignKey: "id_bovino",
  as: "bovino"
});

Bovino.hasMany(Ciclo, {
  foreignKey: "id_bovino",
  as: "ciclos"
});

