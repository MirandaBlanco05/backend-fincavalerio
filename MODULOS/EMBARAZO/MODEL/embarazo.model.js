const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");
 
const Embarazo = sequelize.define("EMBARAZO", {
  id_embarazo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_inseminacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_veterinario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fase: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  fecha_secado: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  fecha_prevista_parto: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: "EMBARAZO",
  schema: "public",
  timestamps: false,
  timestamps: false
});
 
module.exports = Embarazo;
 