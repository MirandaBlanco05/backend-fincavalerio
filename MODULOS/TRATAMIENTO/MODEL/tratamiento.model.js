const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Tratamiento = sequelize.define("TRATAMIENTO", {
  id_tratamiento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_enfermedad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tipo_tratamiento: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: "TRATAMIENTO",
  schema: "public",
  timestamps: false
});

module.exports = Tratamiento;