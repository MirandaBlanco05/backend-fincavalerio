const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './backend-fincavalerio/.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function checkTable() {
  try {
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'BOVINO'
    `);
    console.log('ESTRUCTURA DE TABLA BOVINO:');
    console.table(results);
    process.exit(0);
  } catch (error) {
    console.error('Error al consultar DB:', error);
    process.exit(1);
  }
}

checkTable();
