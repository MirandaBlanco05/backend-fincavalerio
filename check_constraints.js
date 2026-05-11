const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function checkConstraints() {
  try {
    const [results] = await sequelize.query(`
      SELECT conname, pg_get_constraintdef(oid)
      FROM pg_constraint
      WHERE conrelid = '"BOVINO"'::regclass;
    `);
    console.log('RESTRICCIONES DE LA TABLA BOVINO:');
    console.table(results);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkConstraints();
