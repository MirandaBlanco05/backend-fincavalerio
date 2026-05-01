const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Producto = sequelize.define("PRODUCTO", {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad_stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo_producto: {
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
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: "PRODUCTO",
  schema: "public",
  timestamps: false
});

module.exports = Producto;