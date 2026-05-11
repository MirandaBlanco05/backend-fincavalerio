
const { Vacuna, DetalleVacuna, Insumo, Bovino, Empleado } = require('./MODULOS/VACUNA/MODEL');

async function test() {
  try {
    const vacunas = await Vacuna.findAll({
      include: [
        { model: Insumo, as: 'insumo', attributes: ['nombre_insumo'] },
        {
          model: DetalleVacuna,
          as: 'detalles',
          include: [
            { model: Bovino, as: 'bovino', attributes: ['nombre'] },
            { model: Empleado, as: 'empleado', attributes: ['nombre'] }
          ]
        }
      ]
    });
    console.log("✅ Vacunas cargadas:", vacunas.length);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en Vacuna.findAll:", err.message);
    if (err.parent) console.error("SQL Error:", err.parent.message);
    process.exit(1);
  }
}

test();
