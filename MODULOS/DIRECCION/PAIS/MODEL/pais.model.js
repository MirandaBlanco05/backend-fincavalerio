const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../CORE/DATABASE/sequelize");
 
const Pais = sequelize.define("PAIS", {
  id_pais: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: "PAIS",
  schema: "public",
  timestamps: false
});
 
module.exports = Pais;
 