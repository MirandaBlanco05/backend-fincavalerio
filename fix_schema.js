
const { sequelize } = require('./CORE/DATABASE/sequelize');
const { QueryTypes } = require('sequelize');

async function fix() {
  try {
    console.log("🚀 Iniciando corrección de esquema...");

    // 1. Agregar HISTORIAL.fecha si falta
    try {
      await sequelize.query('ALTER TABLE "HISTORIAL" ADD COLUMN IF NOT EXISTS "fecha" DATE;', { type: QueryTypes.RAW });
      console.log("✅ Columna HISTORIAL.fecha verificada/agregada.");
    } catch (e) {
      console.error("❌ Error en HISTORIAL.fecha:", e.message);
    }

    // 2. Agregar TRATAMIENTO.id_bovino si falta
    try {
      await sequelize.query('ALTER TABLE "TRATAMIENTO" ADD COLUMN IF NOT EXISTS "id_bovino" INTEGER;', { type: QueryTypes.RAW });
      console.log("✅ Columna TRATAMIENTO.id_bovino verificada/agregada.");
    } catch (e) {
      console.error("❌ Error en TRATAMIENTO.id_bovino:", e.message);
    }

    // 3. Crear tabla VACUNA si falta
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "VACUNA" (
          "id_vacuna" SERIAL PRIMARY KEY,
          "id_insumo" INTEGER NOT NULL,
          "tipo_vacuna" VARCHAR(100) NOT NULL,
          "fecha" DATE NOT NULL
        );
      `, { type: QueryTypes.RAW });
      console.log("✅ Tabla VACUNA verificada/creada.");
    } catch (e) {
      console.error("❌ Error en tabla VACUNA:", e.message);
    }

    // 4. Crear tabla DETALLE_VACUNA si falta
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "DETALLE_VACUNA" (
          "id_vacuna" INTEGER NOT NULL,
          "id_bovino" INTEGER NOT NULL,
          "id_empleado" INTEGER NOT NULL,
          PRIMARY KEY ("id_vacuna", "id_bovino"),
          FOREIGN KEY ("id_vacuna") REFERENCES "VACUNA"("id_vacuna") ON DELETE CASCADE
        );
      `, { type: QueryTypes.RAW });
      console.log("✅ Tabla DETALLE_VACUNA verificada/creada.");
    } catch (e) {
      console.error("❌ Error en tabla DETALLE_VACUNA:", e.message);
    }

    console.log("🏁 Corrección finalizada.");
    process.exit(0);
  } catch (err) {
    console.error("💥 Error fatal:", err);
    process.exit(1);
  }
}

fix();
