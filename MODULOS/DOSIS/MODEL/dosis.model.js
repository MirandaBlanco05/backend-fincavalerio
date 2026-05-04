const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Dosis = sequelize.define("DOSIS", {
  id_dosis: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_tratamiento: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  unidad: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  hora_aplicacion: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  id_insumo: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "DOSIS",
  schema: "public",
  timestamps: false
});

module.exports = Dosis;