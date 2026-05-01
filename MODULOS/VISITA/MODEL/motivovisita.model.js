
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const MotivoVisita = sequelize.define("MOTIVO_VISITA", {
  id_visita: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_motivo: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: "MOTIVO_VISITA",
   schema: "public",
  timestamps: false
});

module.exports = MotivoVisita;
