const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const ComprobanteFiscal = sequelize.define("COMPROBANTE_FISCAL", {
  id_comprobante: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tipo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  serie: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: "COMPROBANTE_FISCAL",
  schema: "public",
  timestamps: false
});

module.exports = ComprobanteFiscal;