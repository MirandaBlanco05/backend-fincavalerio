
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const GrupoBovino = sequelize.define("GRUPO_BOVINO", {
  Id_grupo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  caracteristicas: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: "GRUPO_BOVINO",
  timestamps: false
});

module.exports = GrupoBovino;
