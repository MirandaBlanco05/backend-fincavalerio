const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function countRows() {
  try {
    const [[{ count }]] = await sequelize.query('SELECT COUNT(*) as count FROM "BOVINO"');
    console.log(`La tabla BOVINO tiene ${count} registros.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

countRows();
