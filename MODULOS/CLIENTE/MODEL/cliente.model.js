const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Cliente = sequelize.define("CLIENTE", {
  id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rnc: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nombre: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  id_provincia: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(8),
    allowNull: true
  }
}, {
  tableName: "CLIENTE",
  schema: "public",
  timestamps: false,
  timestamps: false
});

module.exports = Cliente;