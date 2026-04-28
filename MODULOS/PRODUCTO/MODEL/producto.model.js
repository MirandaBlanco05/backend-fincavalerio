const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Producto = sequelize.define("PRODUCTO", {
  Id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Cantidad_stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Tipo_producto: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  precio_costo: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  peso: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  precio_venta: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  Descripcion: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: "PRODUCTO",
  timestamps: false
});

module.exports = Producto;