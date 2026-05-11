const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function fixSequences() {
  try {
    console.log('Sincronizando contadores de ID...');
    
    // Lista de tablas principales para arreglar sus secuencias
    const tables = [
      { table: 'BOVINO', id: 'id_bovino' },
      { table: 'RAZA', id: 'id_raza' },
      { table: 'GRUPO_BOVINO', id: 'id_grupo' },
      { table: 'ORDENIO', id: 'id_ordenio' }
    ];

    for (const t of tables) {
      await sequelize.query(`
        SELECT setval(
          pg_get_serial_sequence('"${t.table}"', '${t.id}'),
          COALESCE(MAX("${t.id}"), 0) + 1,
          false
        ) FROM "${t.table}";
      `);
      console.log(`✅ Contador de ${t.table} sincronizado.`);
    }

    console.log('🚀 Todos los contadores están al día.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixSequences();
