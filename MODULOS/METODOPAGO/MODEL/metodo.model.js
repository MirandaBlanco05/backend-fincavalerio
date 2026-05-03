const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const MetodoPago = sequelize.define("METODO_PAGO", {
  id_metodo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo_metodo: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: "METODO_PAGO",
  schema: "public",
  timestamps: false
});

module.exports = MetodoPago;