
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const MotivoVisita = sequelize.define("MOTIVO_VISITA", {
  Id_visita: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  Id_motivo: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: "MOTIVO_VISITA",
  timestamps: false
});

module.exports = MotivoVisita;
