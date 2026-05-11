// MODULOS/PARTO/MODEL/parto.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");
 
const Parto = sequelize.define("PARTO", {
  id_parto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_embarazo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_parto: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  numero_crias: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tipo_parto: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  sexo_cria: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  peso_cria: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  estado_cria: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  observaciones: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: "PARTO",
  schema: "public",
  timestamps: false
});
 
module.exports = Parto;