const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Motivo = sequelize.define("MOTIVO", {
  Id_motivo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  motivo: {
    type: DataTypes.STRING
  }
}, {
  tableName: "MOTIVO",
  timestamps: false
});

module.exports = Motivo;
