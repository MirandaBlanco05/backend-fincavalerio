const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const SecuenciaNcf = sequelize.define("SECUENCIA_NCF", {
  id_secuencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_comprobante: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  secuencia: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: "SECUENCIA_NCF",
  schema: "public",
  timestamps: false
});

module.exports = SecuenciaNcf;