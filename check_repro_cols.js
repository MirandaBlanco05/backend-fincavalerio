const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function checkCols() {
  const tables = ["INSEMINACION", "EMBARAZO", "PARTO"];
  for (const table of tables) {
    const [results] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = '${table}'
    `);
    console.log(`Columnas de ${table}:`, results.map(r => r.column_name).join(', '));
  }
  process.exit(0);
}

checkCols();
