const { sequelize } = require('./CORE/DATABASE/sequelize');

async function checkSchema() {
  try {
    const tables = ['HISTORIAL', 'HISTORIAL_ENFERMEDAD', 'TRATAMIENTO'];
    for (const table of tables) {
      console.log(`--- Table: ${table} ---`);
      const [cols] = await sequelize.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${table}';
      `);
      console.log(JSON.stringify(cols, null, 2));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
