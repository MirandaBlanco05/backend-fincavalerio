const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Insumo = sequelize.define("INSUMO", {
  id_insumo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tipo_insumo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  uso: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  cantidad_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "Activo"
  }
}, {
  tableName: "INSUMO",
  schema: "public",
  timestamps: false
});

module.exports = Insumo;