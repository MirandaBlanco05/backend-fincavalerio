const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const HistorialEnfermedad = sequelize.define("HISTORIAL_ENFERMEDAD", {
  id_historial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  id_enfermedad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  }
}, {
  tableName: "HISTORIAL_ENFERMEDAD",
  schema: "public",
  timestamps: false
});

module.exports = HistorialEnfermedad;