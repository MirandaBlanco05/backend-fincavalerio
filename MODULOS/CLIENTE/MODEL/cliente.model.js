const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Cliente = sequelize.define("CLIENTE", {
  Id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  RNC: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  Telefono: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  Correo: {
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
  Estado: {
    type: DataTypes.STRING(8),
    allowNull: true
  }
}, {
  tableName: "CLIENTE",
  timestamps: false
});

module.exports = Cliente;