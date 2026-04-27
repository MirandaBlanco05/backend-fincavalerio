const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Provincia = sequelize.define("PROVINCIA", {
  id_provincia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  id_pais: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "PROVINCIA",
  timestamps: false
});

module.exports = Provincia;