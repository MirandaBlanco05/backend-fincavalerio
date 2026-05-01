
const Bovino = require("./bovino.model");
const Raza = require("./raza.model");
const GrupoBovino = require("./grupo.model");

// RELACIONES

// RAZA -> BOVINO
Raza.hasMany(Bovino, { foreignKey: "id_raza" });
Bovino.belongsTo(Raza, { foreignKey: "id_raza" });

// GRUPO -> BOVINO
GrupoBovino.hasMany(Bovino, { foreignKey: "id_grupo" });
Bovino.belongsTo(GrupoBovino, { foreignKey: "id_grupo" });

module.exports = {
  Bovino,
  Raza,
  GrupoBovino
};
