
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Visita = sequelize.define("VISITA", {
  Id_visita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Id_veterinario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Id_bovino: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  observaciones: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: "VISITA",
  timestamps: false
});

module.exports = Visita;
