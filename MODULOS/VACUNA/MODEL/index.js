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

// Relaciones externas
const Bovino = require("../../BOVINO/MODEL/bovino.model");
const Empleado = require("../../EMPLEADO/MODEL/empleado.model");
const Insumo = require("../../INSUMO/MODEL/insumo.model");

DetalleVacuna.belongsTo(Bovino, { foreignKey: "id_bovino", as: "bovino" });
DetalleVacuna.belongsTo(Empleado, { foreignKey: "id_empleado", as: "empleado" });
Vacuna.belongsTo(Insumo, { foreignKey: "id_insumo", as: "insumo" });

module.exports = { Vacuna, DetalleVacuna, Bovino, Empleado, Insumo };