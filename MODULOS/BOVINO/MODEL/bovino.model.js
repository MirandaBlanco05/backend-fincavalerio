const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Bovino = sequelize.define("BOVINO", {
  id_bovino: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_grupo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numero_crotal: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_raza: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  nombre_madre: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  sexo: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  peso: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: "BOVINO",
  schema: "public",
  freezeTableName: true,
  timestamps: false
});

module.exports = Bovino;