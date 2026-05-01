const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false
  }
);

const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize conectado correctamente a la BD");
  } catch (error) {
    console.error("❌ Error al conectar Sequelize:", error.message);
  }
};

module.exports = { sequelize, conectarDB };
