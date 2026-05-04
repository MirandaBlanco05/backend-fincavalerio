// MODULOS/PROVEEDOR/MODEL/index.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Proveedor = sequelize.define("PROVEEDOR", {
  id_proveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  rnc: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  id_provincia: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo_proveedor: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "Activo"
  }
}, {
  tableName: "PROVEEDOR",
  schema: "public",
  timestamps: false
});

module.exports = Proveedor;