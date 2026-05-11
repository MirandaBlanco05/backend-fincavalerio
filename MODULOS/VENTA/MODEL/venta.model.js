const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Venta = sequelize.define("VENTA", {
  id_venta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  concepto: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ncf: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  metodo_pago: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: "Efectivo"
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "activo"
  }
}, {
  tableName: "VENTA",
  schema: "public",
  timestamps: false
});

module.exports = Venta;