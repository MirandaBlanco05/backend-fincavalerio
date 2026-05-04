const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Historial = sequelize.define("HISTORIAL", {
  id_historial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_bovino: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "HISTORIAL",
  schema: "public",
  timestamps: false
});

module.exports = Historial;