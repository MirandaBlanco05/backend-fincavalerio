const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function deepClean() {
  const tasks = [
    { table: "INSEMINACION", col: "id_ciclo", ref: "CICLO_CELO" },
    { table: "EMBARAZO", col: "id_inseminacion", ref: "INSEMINACION" },
    { table: "PARTO", col: "id_embarazo", ref: "EMBARAZO" }
  ];

  try {
    for (const t of tasks) {
      console.log(`Auditando tabla: ${t.table}...`);
      const [constraints] = await sequelize.query(`
        SELECT conname FROM pg_constraint
        WHERE conrelid = '"${t.table}"'::regclass AND contype = 'f';
      `);

      console.log(`⚠️ Eliminando ${constraints.length} reglas en ${t.table}...`);
      for (const c of constraints) {
        await sequelize.query(`ALTER TABLE "${t.table}" DROP CONSTRAINT "${c.conname}"`);
      }
      
      console.log(`Re-creando regla limpia: ${t.table}(${t.col}) -> ${t.ref}(${t.col})`);
      await sequelize.query(`
        ALTER TABLE "${t.table}" 
        ADD CONSTRAINT "fk_${t.table.toLowerCase()}_${t.ref.toLowerCase()}" 
        FOREIGN KEY (${t.col}) REFERENCES "${t.ref}"(${t.col})
      `);
      console.log(`✅ Tabla ${t.table} saneada.`);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deepClean();
