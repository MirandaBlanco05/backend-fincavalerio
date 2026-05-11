const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function killConnections() {
  try {
    console.log('Cerrando conexiones inactivas...');
    await sequelize.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = current_database()
      AND pid <> pg_backend_pid();
    `);
    console.log('✅ Conexiones reseteadas.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

killConnections();
