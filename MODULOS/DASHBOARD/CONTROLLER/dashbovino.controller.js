const { sequelize } = require("../../../CORE/DATABASE/sequelize");
const { QueryTypes } = require("sequelize");

const getDashboardAnimales = async (req, res) => {
  try {

    // --- KPI: totales del hato ---
    const totales = await sequelize.query(`
      SELECT
        COUNT(*)                                          AS total,
        COUNT(CASE WHEN estado = 'activo' THEN 1 END)    AS activos,
        COUNT(CASE WHEN estado != 'activo' THEN 1 END)   AS inactivos,
        COUNT(CASE WHEN sexo = 'Hembra' THEN 1 END)      AS hembras,
        COUNT(CASE WHEN sexo = 'Macho'  THEN 1 END)      AS machos
      FROM public."BOVINO"
    `, { type: QueryTypes.SELECT });

    // --- KPI: valor total del hato (suma precio_venta de productos tipo bovino) ---
    const valorHato = await sequelize.query(`
      SELECT COALESCE(SUM(precio_venta * cantidad_stock), 0) AS valor_total
      FROM public."PRODUCTO"
      WHERE tipo_producto ILIKE '%bov%'
         OR tipo_producto ILIKE '%ganado%'
         OR tipo_producto ILIKE '%ternero%'
         OR tipo_producto ILIKE '%reproductor%'
    `, { type: QueryTypes.SELECT });

    // --- GRAFICA: distribucion por grupo (donut) ---
    const porGrupo = await sequelize.query(`
      SELECT g.nombre AS grupo, COUNT(*) AS cantidad
      FROM public."BOVINO" b
      JOIN public."GRUPO_BOVINO" g ON g.id_grupo = b.id_grupo
      WHERE b.estado = 'activo'
      GROUP BY g.nombre
      ORDER BY cantidad DESC
    `, { type: QueryTypes.SELECT });

    // --- GRAFICA: distribucion por raza ---
    const porRaza = await sequelize.query(`
      SELECT r."Tipo_raza" AS raza, COUNT(*) AS cantidad
      FROM public."BOVINO" b
      JOIN public."RAZA" r ON r.id_raza = b.id_raza
      WHERE b.estado = 'activo'
      GROUP BY r."Tipo_raza"
      ORDER BY cantidad DESC
    `, { type: QueryTypes.SELECT });

    // --- GRAFICA: produccion por bovino este mes (top 10) ---
    const produccionPorBovino = await sequelize.query(`
      SELECT
        b.numero_crotal,
        b.nombre,
        SUM(CAST(o.cantidad_total AS NUMERIC)) AS litros_mes
      FROM public."ORDENIO" o
      JOIN public."BOVINO" b ON b.id_bovino = o.id_bovino
      WHERE DATE_TRUNC('month', o.fecha) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY b.id_bovino, b.numero_crotal, b.nombre
      ORDER BY litros_mes DESC
      LIMIT 10
    `, { type: QueryTypes.SELECT });

    // --- TABLA: listado de bovinos ---
    const listado = await sequelize.query(`
      SELECT
        b.id_bovino,
        b.numero_crotal,
        b.nombre,
        b.sexo,
        b.edad,
        b.estado,
        b.peso,
        b.fecha_nacimiento,
        g.nombre AS grupo,
        r."Tipo_raza" AS raza
      FROM public."BOVINO" b
      JOIN public."GRUPO_BOVINO" g ON g.id_grupo = b.id_grupo
      JOIN public."RAZA" r         ON r.id_raza  = b.id_raza
      ORDER BY b.estado, b.numero_crotal
      LIMIT 200
    `, { type: QueryTypes.SELECT });

    const r = totales[0];
    res.json({
      kpis: {
        total:      Number(r.total),
        activos:    Number(r.activos),
        inactivos:  Number(r.inactivos),
        hembras:    Number(r.hembras),
        machos:     Number(r.machos),
        valor_hato: Number(valorHato[0].valor_total),
      },
      graficas: {
        por_grupo:             porGrupo,
        por_raza:              porRaza,
        produccion_por_bovino: produccionPorBovino,
      },
      listado,
    });
  } catch (error) {
    console.error("[dashboard/animales]", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboardAnimales };