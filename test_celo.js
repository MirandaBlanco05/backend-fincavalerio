const { Ciclo } = require("./MODULOS/REPRODUCCION/MODEL");
require("dotenv").config({ path: './.env' });

async function testInsert() {
  try {
    console.log('Intentando insertar ciclo de prueba...');
    const nuevo = await Ciclo.create({
      id_bovino: 90, // Un ID que sabemos que existe
      fecha_inicio: '2026-05-10',
      fecha_fin: '2026-05-12',
      duracion: '2',
      observaciones: 'Prueba técnica de inserción'
    });
    console.log('✅ Inserción exitosa:', nuevo.id_ciclo);
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR EN INSERCIÓN:', error.message);
    if (error.errors) console.log(error.errors.map(e => e.message));
    process.exit(1);
  }
}

testInsert();
