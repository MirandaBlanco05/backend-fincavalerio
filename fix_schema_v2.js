const { sequelize } = require('./CORE/DATABASE/sequelize');

async function migrate() {
  try {
    console.log('Migrating HISTORIAL...');
    await sequelize.query('ALTER TABLE "HISTORIAL" ADD COLUMN IF NOT EXISTS "fecha" DATE;');
    
    console.log('Migrating TRATAMIENTO...');
    await sequelize.query('ALTER TABLE "TRATAMIENTO" ADD COLUMN IF NOT EXISTS "id_bovino" INTEGER;');
    
    // Also ensure foreign keys exist for id_bovino in TRATAMIENTO
    console.log('Adding foreign key to TRATAMIENTO...');
    await sequelize.query(`
      ALTER TABLE "TRATAMIENTO" 
      ADD CONSTRAINT "fk_tratamiento_bovino" 
      FOREIGN KEY ("id_bovino") REFERENCES "BOVINO"("id_bovino") 
      ON DELETE CASCADE ON UPDATE CASCADE;
    `).catch(err => {
      if (err.message.includes('already exists')) {
        console.log('Constraint fk_tratamiento_bovino already exists.');
      } else {
        throw err;
      }
    });

    console.log('✅ Migration completed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
