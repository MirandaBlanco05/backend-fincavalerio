const { Sequelize } = require("sequelize");
require("dotenv").config({ path: './backend-fincavalerio/.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

async function checkIndices() {
  try {
    const [results] = await sequelize.query(`
      SELECT
          t.relname as table_name,
          i.relname as index_name,
          a.attname as column_name,
          ix.indisunique as is_unique
      FROM
          pg_class t,
          pg_class i,
          pg_index ix,
          pg_attribute a
      WHERE
          t.oid = ix.indrelid
          AND i.oid = ix.indexrelid
          AND a.attrelid = t.oid
          AND a.attnum = ANY(ix.indkey)
          AND t.relkind = 'r'
          AND t.relname = 'BOVINO'
      ORDER BY
          t.relname,
          i.relname;
    `);
    console.log('ÍNDICES Y REGLAS DE LA TABLA BOVINO:');
    console.table(results);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkIndices();
