const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Inseminacion = sequelize.define("INSEMINACION", {
  Id_inseminacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Id_veterinaro: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Id_ciclo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Tipo_inseminacion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['Asistida', 'Monta natural', 'Artificial']]
    }
  },
  resultado: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['Inefectiva', 'Efectiva']]
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: "INSEMINACION",
  timestamps: false
});

module.exports = Inseminacion;
