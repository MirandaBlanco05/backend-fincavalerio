
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Raza = sequelize.define("RAZA", {
  Id_raza: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Tipo_raza: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  origen: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Descripcion: {
    type: DataTypes.STRING(150),
    allowNull: true
  }
}, {
  tableName: "RAZA",
  timestamps: false
});

module.exports = Raza;
