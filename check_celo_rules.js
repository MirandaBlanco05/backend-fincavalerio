const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function checkCeloConstraints() {
  try {
    const [results] = await sequelize.query(`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = '"CICLO_CELO"'::regclass
      AND contype = 'f';
    `);
    console.log('REGLAS (CONSTRAINTS) DE CICLO_CELO:');
    console.table(results);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkCeloConstraints();
