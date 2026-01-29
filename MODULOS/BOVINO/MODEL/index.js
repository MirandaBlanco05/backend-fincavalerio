
const Bovino = require("./bovino.model");
const Raza = require("./raza.model");
const GrupoBovino = require("./grupo.model");

// RELACIONES

// RAZA -> BOVINO
Raza.hasMany(Bovino, { foreignKey: "Id_raza" });
Bovino.belongsTo(Raza, { foreignKey: "Id_raza" });

// GRUPO -> BOVINO
GrupoBovino.hasMany(Bovino, { foreignKey: "Id_grupo" });
Bovino.belongsTo(GrupoBovino, { foreignKey: "Id_grupo" });

module.exports = {
  Bovino,
  Raza,
  GrupoBovino
};
