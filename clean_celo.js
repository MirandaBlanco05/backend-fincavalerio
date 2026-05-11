const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function cleanCelo() {
  try {
    console.log('Iniciando limpieza de la tabla CICLO_CELO...');
    
    // Obtener todas las llaves foráneas duplicadas
    const [constraints] = await sequelize.query(`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = '"CICLO_CELO"'::regclass
      AND contype = 'f';
    `);

    for (const c of constraints) {
      console.log(`Eliminando: ${c.conname}`);
      await sequelize.query(`ALTER TABLE "CICLO_CELO" DROP CONSTRAINT "${c.conname}"`);
    }

    console.log('Re-creando regla de conexión limpia...');
    await sequelize.query(`
      ALTER TABLE "CICLO_CELO" 
      ADD CONSTRAINT "fk_celo_bovino" 
      FOREIGN KEY (id_bovino) REFERENCES "BOVINO"(id_bovino)
    `);

    console.log('✅ Tabla CICLO_CELO reparada y limpia.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanCelo();
