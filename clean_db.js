const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function cleanDatabase() {
  try {
    console.log('Iniciando limpieza profunda de la tabla BOVINO...');
    
    // 1. Obtener todos los nombres de las llaves foráneas duplicadas
    const [constraints] = await sequelize.query(`
      SELECT conname 
      FROM pg_constraint 
      WHERE conrelid = '"BOVINO"'::regclass 
      AND contype = 'f'
    `);

    // 2. Borrarlas todas
    for (const c of constraints) {
      console.log(`Eliminando restricción: ${c.conname}`);
      await sequelize.query(`ALTER TABLE "BOVINO" DROP CONSTRAINT "${c.conname}"`);
    }

    console.log('✅ Limpieza completada. Ahora re-creando las reglas necesarias...');

    // 3. Re-crear solo las 2 reglas necesarias (Grupo y Raza) de forma limpia
    await sequelize.query(`
      ALTER TABLE "BOVINO" 
      ADD CONSTRAINT fk_bovino_grupo FOREIGN KEY (id_grupo) REFERENCES "GRUPO_BOVINO"(id_grupo) ON DELETE CASCADE,
      ADD CONSTRAINT fk_bovino_raza FOREIGN KEY (id_raza) REFERENCES "RAZA"(id_raza) ON DELETE CASCADE
    `);

    console.log('🚀 Base de datos optimizada y reparada.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la limpieza:', error.message);
    process.exit(1);
  }
}

cleanDatabase();
