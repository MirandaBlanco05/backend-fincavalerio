const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");
 
const Embarazo = sequelize.define("EMBARAZO", {
  Id_embarazo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Id_inseminacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Id_veterinario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fase: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Fecha_secado: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Fecha_prevista_parto: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: "EMBARAZO",
  timestamps: false
});
 
module.exports = Embarazo;
 