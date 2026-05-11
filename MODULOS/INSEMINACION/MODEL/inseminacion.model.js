const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Inseminacion = sequelize.define("INSEMINACION", {
  id_inseminacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_veterinario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_ciclo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo_inseminacion: {
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
      isIn: [['Inefectiva', 'Efectiva', 'Pendiente']]
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: "INSEMINACION",
  schema: "public",
  timestamps: false,
  timestamps: false
});

module.exports = Inseminacion;
