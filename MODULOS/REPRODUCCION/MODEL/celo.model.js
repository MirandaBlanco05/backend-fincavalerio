const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Ciclo = sequelize.define("CICLO_CELO", {
  Id_ciclo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Id_bovino: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  Fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  duracion: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  observaciones: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: "CICLO_CELO",
  timestamps: false
});

module.exports = Ciclo;
