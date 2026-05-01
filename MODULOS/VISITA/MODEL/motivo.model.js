const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Motivo = sequelize.define("MOTIVO", {
  id_motivo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  motivo: {
    type: DataTypes.STRING
  }
}, {
  tableName: "MOTIVO",
   schema: "public",
  timestamps: false
});

module.exports = Motivo;
