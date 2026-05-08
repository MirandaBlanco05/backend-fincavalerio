const { sequelize } = require("../../../CORE/DATABASE/sequelize");
const { QueryTypes } = require("sequelize");

const getDashboardOrdeno = async (req, res) => {
  try {
    const mes  = req.query.mes  || new Date().getMonth() + 1;
    const anio = req.query.anio || new Date().getFullYear();

    // --- KPI: totales del mes ---
    const totales = await sequelize.query(`
      SELECT
        COALESCE(SUM(CAST(cantidad_total AS NUMERIC)), 0)                       AS total_litros,
        COUNT(DISTINCT fecha)                                                    AS dias_ordenio,
        ROUND(
          SUM(CAST(cantidad_total AS NUMERIC)) /
          NULLIF(COUNT(DISTINCT fecha), 0), 2
        )                                                                        AS promedio_diario
      FROM public."ORDENIO"
      WHERE EXTRACT(MONTH FROM fecha) = :mes
        AND EXTRACT(YEAR  FROM fecha) = :anio
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    // --- KPI: bovino mas productivo ---
    const bovinoTop = await sequelize.query(`
      SELECT
        b.numero_crotal,
        b.nombre,
        SUM(CAST(o.cantidad_total AS NUMERIC))  AS total_litros,
        ROUND(AVG(CAST(o.cantidad_total AS NUMERIC)), 2) AS promedio_diario
      FROM public."ORDENIO" o
      JOIN public."BOVINO" b ON b.id_bovino = o.id_bovino
      WHERE EXTRACT(MONTH FROM o.fecha) = :mes
        AND EXTRACT(YEAR  FROM o.fecha) = :anio
      GROUP BY b.id_bovino, b.numero_crotal, b.nombre
      ORDER BY total_litros DESC
      LIMIT 1
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    // --- KPI: empleado mas eficiente ---
    const empleadoTop = await sequelize.query(`
      SELECT
        e.nombre,
        COUNT(*) AS total_ordenios,
        SUM(CAST(o.cantidad_total AS NUMERIC)) AS total_litros
      FROM public."ORDENIO" o
      JOIN public."EMPLEADO" e ON e.id_empleado = o.id_empleado
      WHERE EXTRACT(MONTH FROM o.fecha) = :mes
        AND EXTRACT(YEAR  FROM o.fecha) = :anio
      GROUP BY e.id_empleado, e.nombre
      ORDER BY total_ordenios DESC
      LIMIT 1
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: produccion diaria (linea) ---
    const produccionDiaria = await sequelize.query(`
      SELECT
        fecha,
        SUM(CAST(cantidad_total AS NUMERIC)) AS litros
      FROM public."ORDENIO"
      WHERE EXTRACT(MONTH FROM fecha) = :mes
        AND EXTRACT(YEAR  FROM fecha) = :anio
      GROUP BY fecha
      ORDER BY fecha
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: manana vs tarde (pie) ---
    const turnoPie = await sequelize.query(`
      SELECT
        momento_dia AS turno,
        SUM(CAST(cantidad_total AS NUMERIC)) AS litros,
        COUNT(*) AS ordenios
      FROM public."ORDENIO"
      WHERE EXTRACT(MONTH FROM fecha) = :mes
        AND EXTRACT(YEAR  FROM fecha) = :anio
        AND momento_dia IS NOT NULL
      GROUP BY momento_dia
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: ranking de bovinos top 10 (barras) ---
    const rankingBovinos = await sequelize.query(`
      SELECT
        b.numero_crotal,
        b.nombre,
        SUM(CAST(o.cantidad_total AS NUMERIC))           AS total_litros,
        ROUND(AVG(CAST(o.cantidad_total AS NUMERIC)), 2) AS promedio_diario,
        COUNT(DISTINCT o.fecha)                          AS dias_ordenio
      FROM public."ORDENIO" o
      JOIN public."BOVINO" b ON b.id_bovino = o.id_bovino
      WHERE EXTRACT(MONTH FROM o.fecha) = :mes
        AND EXTRACT(YEAR  FROM o.fecha) = :anio
      GROUP BY b.id_bovino, b.numero_crotal, b.nombre
      ORDER BY total_litros DESC
      LIMIT 10
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: produccion semanal ---
    const produccionSemanal = await sequelize.query(`
      SELECT
        DATE_TRUNC('week', fecha) AS semana,
        SUM(CAST(cantidad_total AS NUMERIC)) AS litros
      FROM public."ORDENIO"
      WHERE EXTRACT(MONTH FROM fecha) = :mes
        AND EXTRACT(YEAR  FROM fecha) = :anio
      GROUP BY semana
      ORDER BY semana
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    res.json({
      kpis: {
        total_litros:    Number(totales[0].total_litros),
        promedio_diario: Number(totales[0].promedio_diario),
        dias_ordenio:    Number(totales[0].dias_ordenio),
        bovino_top:      bovinoTop[0]   || null,
        empleado_top:    empleadoTop[0] || null,
      },
      graficas: {
        produccion_diaria:  produccionDiaria,
        turno_pie:          turnoPie,
        ranking_bovinos:    rankingBovinos,
        produccion_semanal: produccionSemanal,
      },
    });
  } catch (error) {
    console.error("[dashboard/ordeno]", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboardOrdeno };