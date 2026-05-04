const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const CompraProveedor = sequelize.define("COMPRA_PROVEEDOR", {
  id_compra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  ncf: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: "COMPRA_PROVEEDOR",
  schema: "public",
  timestamps: false
});

module.exports = CompraProveedor;