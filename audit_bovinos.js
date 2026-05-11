const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function auditBovinos() {
  try {
    const [results] = await sequelize.query('SELECT estado, COUNT(*) as cantidad FROM "BOVINO" GROUP BY estado');
    console.log('RESUMEN DE ESTADOS EN LA BASE DE DATOS:');
    console.table(results);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

auditBovinos();
