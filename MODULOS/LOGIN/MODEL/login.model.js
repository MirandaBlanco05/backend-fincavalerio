const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Login = sequelize.define("LOGIN", {
  id_login: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Usuario: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  Contraseña: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  Tipo_usuario: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: "LOGIN",
  timestamps: false
});

module.exports = Login;
