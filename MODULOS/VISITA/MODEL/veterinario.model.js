const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Veterinario = sequelize.define("VETERINARIO", {
  id_veterinario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  cedula: {
    type: DataTypes.STRING(13),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: false
  }
}, {
  tableName: "VETERINARIO",
   schema: "public",
  timestamps: false
});

module.exports = Veterinario;
