const { sequelize } = require('./CORE/DATABASE/sequelize');

async function check() {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        conname as name, 
        pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conrelid = 'public."CICLO_CELO"'::regclass;
    `);
    console.log('CONSTRAINTS:', JSON.stringify(results, null, 2));
    
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'CICLO_CELO';
    `);
    console.log('COLUMNS:', JSON.stringify(columns, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
