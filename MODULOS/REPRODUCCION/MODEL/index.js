const Bovino = require("../../BOVINO/MODEL/bovino.model");
const Ciclo = require("../MODEL/celo.model");

// 🔗 CICLO ↔ BOVINO
Ciclo.belongsTo(Bovino, {
  foreignKey: "Id_bovino",
  as: "bovino"
});

Bovino.hasMany(Ciclo, {
  foreignKey: "Id_bovino",
  as: "ciclos"
});

