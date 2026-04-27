// MODULOS/EMPLEADO/MODEL/empleado.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Empleado = sequelize.define("EMPLEADO", {
  Id_empleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  nacionalidad: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  cedula: {
    type: DataTypes.STRING(13),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(13),
    allowNull: false
  },
  salario: {
    type: DataTypes.REAL,
    allowNull: true
  }
}, {
  tableName: "EMPLEADO",
  timestamps: false
});

module.exports = Empleado;