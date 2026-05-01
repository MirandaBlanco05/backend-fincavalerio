
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Visita = sequelize.define("VISITA", {
  id_visita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_veterinario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_bovino: {
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
  },
  hora: {
    type: DataTypes.TIME(7),
    allowNull: true
  }
}, {
  tableName: "VISITA",
   schema: "public",
  timestamps: false
});

module.exports = Visita;
