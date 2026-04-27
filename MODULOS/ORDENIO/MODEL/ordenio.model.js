// MODULOS/ORDENIO/MODEL/ordenio.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Ordenio = sequelize.define("ORDENIO", {
  Id_ordenio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Id_bovino: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Momento_dia: {
    type: DataTypes.STRING(30),
    allowNull: true,
    validate: {
      isIn: [["Mañana", "Tarde"]]
    }
  },
  Cantidad_total: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: "ORDENIO",
  timestamps: false
});

module.exports = Ordenio;