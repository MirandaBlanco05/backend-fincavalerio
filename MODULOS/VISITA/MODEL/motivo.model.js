const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Visita = sequelize.define("MOTIVO", {
  Id_visita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Id_veterinario: {
    type: DataTypes.INTEGER
  },
  Id_bovino: {
    type: DataTypes.INTEGER
  },
  fecha: {
    type: DataTypes.DATE
  }
}, {
  tableName: "MOTIVO",
  timestamps: false
});

module.exports = Visita;
