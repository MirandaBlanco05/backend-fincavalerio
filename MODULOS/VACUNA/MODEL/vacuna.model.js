const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Vacuna = sequelize.define("VACUNA", {
  id_vacuna: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_insumo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "INSUMO",
      key: "id_insumo"
    }
  },
  tipo_vacuna: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: "VACUNA",
  timestamps: false
});

module.exports = Vacuna;