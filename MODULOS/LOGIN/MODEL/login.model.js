const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

const Login = sequelize.define("LOGIN", {
  id_login: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  contrasena: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tipo_usuario: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: "LOGIN",
  schema: "public",
  timestamps: false
});

module.exports = Login;
