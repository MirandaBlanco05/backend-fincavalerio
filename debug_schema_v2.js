const { sequelize } = require('./CORE/DATABASE/sequelize');

async function checkSchema() {
  try {
    console.log('--- HISTORIAL ---');
    const [histCols] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'HISTORIAL_ENFERMEDAD' OR table_name = 'HISTORIAL';
    `);
    console.log(JSON.stringify(histCols, null, 2));

    console.log('--- TRATAMIENTO ---');
    const [tratCols] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'TRATAMIENTO';
    `);
    console.log(JSON.stringify(tratCols, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
