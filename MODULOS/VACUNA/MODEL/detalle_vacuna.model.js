const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const DetalleVacuna = sequelize.define("DETALLE_VACUNA", {
  id_vacuna: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: "VACUNA",
      key: "id_vacuna"
    }
  },
  id_bovino: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "BOVINO",
      key: "id_bovino"
    }
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "EMPLEADO",
      key: "id_empleado"
    }
  }
}, {
  tableName: "DETALLE_VACUNA",
  timestamps: false
});

module.exports = DetalleVacuna;