const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './backend-fincavalerio/.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function fixTable() {
  try {
    console.log('Cambiando numero_crotal a BIGINT...');
    await sequelize.query('ALTER TABLE "BOVINO" ALTER COLUMN numero_crotal TYPE BIGINT');
    console.log('✅ Campo actualizado con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar:', error.message);
    process.exit(1);
  }
}

fixTable();
