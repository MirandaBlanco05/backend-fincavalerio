import { Sequelize } from "sequelize";
import { config } from "../CONFIG/env.js";

export const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPass,
  {
    host: config.dbHost,
    dialect: "mssql",
    logging: false
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexion exitosa con SQL Server");
  } catch (error) {
    console.error("Error al conectar:", error);
  }
};
