const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Veterinario = sequelize.define("VETERINARIO", {
  id_veterinario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cedula: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: "VETERINARIO",
  timestamps: false
});

module.exports = Veterinario;