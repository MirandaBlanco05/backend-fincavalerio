const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function checkNullable() {
  try {
    const [results] = await sequelize.query(`
      SELECT column_name, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'CICLO_CELO'
    `);
    console.log('RESTRICCIONES DE NULIDAD:');
    console.table(results);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkNullable();
