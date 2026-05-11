const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function run() {
  try {
    const [bovinos] = await sequelize.query('SELECT id_bovino FROM "BOVINO" LIMIT 1');
    const id = bovinos[0].id_bovino;
    console.log(`Usando vaca con ID: ${id}`);
    
    await sequelize.query(`
      INSERT INTO "CICLO_CELO" (id_bovino, fecha_inicio, fecha_fin, duracion, observaciones)
      VALUES (${id}, '2026-05-10', '2026-05-12', '2', 'Prueba final de limpieza')
    `);
    
    console.log('✅ ¡INSERCIÓN DE CELO EXITOSA!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

run();
