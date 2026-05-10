const Vacuna = require("./vacuna.model");
const DetalleVacuna = require("./detalle_vacuna.model");

// Asociaciones
Vacuna.hasMany(DetalleVacuna, {
  foreignKey: 'id_vacuna',
  as: 'detalles'
});

DetalleVacuna.belongsTo(Vacuna, {
  foreignKey: 'id_vacuna',
  as: 'vacuna'
});

module.exports = { Vacuna, DetalleVacuna };