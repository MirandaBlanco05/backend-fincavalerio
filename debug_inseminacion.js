const { sequelize } = require('./CORE/DATABASE/sequelize');

async function checkSchema() {
  try {
    const [cols] = await sequelize.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'INSEMINACION';
    `);
    console.log("Columns:", JSON.stringify(cols, null, 2));

    const [checks] = await sequelize.query(`
      SELECT conname AS constraint_name, pg_get_constraintdef(c.oid) AS definition
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE conrelid = '"INSEMINACION"'::regclass;
    `);
    console.log("Constraints:", JSON.stringify(checks, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
