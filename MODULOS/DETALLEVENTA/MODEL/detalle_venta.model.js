const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const DetalleVenta = sequelize.define("DETALLE_VENTA", {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  id_venta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  total: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_metodo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estatus: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  precio_unitario: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: "activo"
  }
}, {
  tableName: "DETALLE_VENTA",
  schema: "public",
  timestamps: false
});

module.exports = DetalleVenta;