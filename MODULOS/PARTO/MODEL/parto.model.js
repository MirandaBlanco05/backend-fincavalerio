// MODULOS/PARTO/MODEL/parto.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");
 
const Parto = sequelize.define("PARTO", {
  Id_parto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Id_embarazo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Fecha_parto: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  Numero_crias: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  observaciones: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: "PARTO",
  timestamps: false
});
 
module.exports = Parto;