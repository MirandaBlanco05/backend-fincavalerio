// MODULOS/ORDENIO/MODEL/ordenio.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Ordenio = sequelize.define("ORDENIO", {
  id_ordenio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_bovino: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  momento_dia: {
    type: DataTypes.STRING(30),
    allowNull: true,
    validate: {
      isIn: [["Mañana", "Tarde"]]
    }
  },
  cantidad_total: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: "ORDENIO",
  schema: "public",
  timestamps: false
});

module.exports = Ordenio;