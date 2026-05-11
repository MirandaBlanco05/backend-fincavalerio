const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function deepClean() {
  const tables = ["INSEMINACION", "EMBARAZO", "PARTO"];
  try {
    for (const table of tables) {
      console.log(`Auditando tabla: ${table}...`);
      const [constraints] = await sequelize.query(`
        SELECT conname FROM pg_constraint
        WHERE conrelid = '"${table}"'::regclass AND contype = 'f';
      `);

      if (constraints.length > 5) {
        console.log(`⚠️ Se encontraron ${constraints.length} reglas duplicadas en ${table}. Limpiando...`);
        for (const c of constraints) {
          await sequelize.query(`ALTER TABLE "${table}" DROP CONSTRAINT "${c.conname}"`);
        }
        
        // Re-crear la regla limpia según el modelo estándar
        if (table === "INSEMINACION") {
          await sequelize.query(`ALTER TABLE "INSEMINACION" ADD CONSTRAINT "fk_inseminacion_bovino" FOREIGN KEY (id_bovino) REFERENCES "BOVINO"(id_bovino)`);
        } else if (table === "EMBARAZO") {
          await sequelize.query(`ALTER TABLE "EMBARAZO" ADD CONSTRAINT "fk_embarazo_bovino" FOREIGN KEY (id_bovino) REFERENCES "BOVINO"(id_bovino)`);
        } else if (table === "PARTO") {
          await sequelize.query(`ALTER TABLE "PARTO" ADD CONSTRAINT "fk_parto_bovino" FOREIGN KEY (id_bovino) REFERENCES "BOVINO"(id_bovino)`);
        }
        console.log(`✅ Tabla ${table} saneada.`);
      } else {
        console.log(`✅ Tabla ${table} está limpia.`);
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

deepClean();
