const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Enfermedad = sequelize.define("ENFERMEDAD", {
  id_enfermedad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  causa: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: "ENFERMEDAD",
  schema: "public",
  timestamps: false
});

module.exports = Enfermedad;