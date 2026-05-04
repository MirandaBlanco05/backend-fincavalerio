const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const DetalleCompra = sequelize.define("DETALLE_COMPRA", {
  id_compra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  id_insumo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  id_metodo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  monto_total: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  tableName: "DETALLE_COMPRA",
  schema: "public",
  timestamps: false
});

module.exports = DetalleCompra;