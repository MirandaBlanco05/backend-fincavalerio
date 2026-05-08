const { sequelize } = require("../../../CORE/DATABASE/sequelize");
const { QueryTypes } = require("sequelize");

const getDashboardReproduccion = async (req, res) => {
  try {
    const anio = req.query.anio || new Date().getFullYear();

    // --- KPI: totales de inseminacion ---
    const totalesInsem = await sequelize.query(`
      SELECT
        COUNT(*)                                                      AS total_inseminaciones,
        COUNT(CASE WHEN resultado = 'Efectiva'   THEN 1 END)         AS exitosas,
        COUNT(CASE WHEN resultado = 'Inefectiva' THEN 1 END)         AS fallidas
      FROM public."INSEMINACION"
      WHERE EXTRACT(YEAR FROM fecha) = :anio
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- KPI: embarazos activos (sin parto registrado aun) ---
    const embarazosActivos = await sequelize.query(`
      SELECT COUNT(*) AS activos
      FROM public."EMBARAZO" e
      WHERE NOT EXISTS (
        SELECT 1 FROM public."PARTO" p WHERE p.id_embarazo = e.id_embarazo
      )
    `, { type: QueryTypes.SELECT });

    // --- KPI: partos exitosos en el año ---
    const partos = await sequelize.query(`
      SELECT
        COUNT(*)              AS total_partos,
        SUM(numero_crias)     AS total_crias
      FROM public."PARTO" p
      JOIN public."EMBARAZO" e       ON e.id_embarazo    = p.id_embarazo
      JOIN public."INSEMINACION" ins ON ins.id_inseminacion = e.id_inseminacion
      WHERE EXTRACT(YEAR FROM p.fecha_parto) = :anio
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    const total    = Number(totalesInsem[0].total_inseminaciones);
    const exitosas = Number(totalesInsem[0].exitosas);
    const tasaExito = total > 0 ? ((exitosas / total) * 100).toFixed(1) : 0;

    // --- GRAFICA: funnel inseminacion → embarazo → parto ---
    const embarazosTotal = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM public."EMBARAZO" e
      JOIN public."INSEMINACION" ins ON ins.id_inseminacion = e.id_inseminacion
      WHERE EXTRACT(YEAR FROM ins.fecha) = :anio
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    const funnel = [
      { etapa: "Inseminaciones",        valor: total },
      { etapa: "Embarazos confirmados", valor: Number(embarazosTotal[0].total) },
      { etapa: "Partos registrados",    valor: Number(partos[0].total_partos) },
    ];

    // --- GRAFICA: exito por veterinario (barras) ---
    const porVeterinario = await sequelize.query(`
      SELECT
        v.nombre                                                        AS veterinario,
        COUNT(*)                                                        AS total,
        COUNT(CASE WHEN ins.resultado = 'Efectiva' THEN 1 END)         AS exitosas,
        ROUND(
          COUNT(CASE WHEN ins.resultado = 'Efectiva' THEN 1 END)::NUMERIC
          / NULLIF(COUNT(*), 0) * 100, 1
        )                                                               AS tasa_exito
      FROM public."INSEMINACION" ins
      JOIN public."VETERINARIO" v ON v.id_veterinario = ins.id_veterinario
      WHERE EXTRACT(YEAR FROM ins.fecha) = :anio
      GROUP BY v.nombre
      ORDER BY tasa_exito DESC
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: nacimientos por mes (linea) ---
    const nacimientosMes = await sequelize.query(`
      SELECT
        EXTRACT(MONTH FROM p.fecha_parto)::INT AS mes,
        COUNT(*)                               AS partos,
        SUM(p.numero_crias)                    AS crias
      FROM public."PARTO" p
      WHERE EXTRACT(YEAR FROM p.fecha_parto) = :anio
      GROUP BY mes
      ORDER BY mes
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: tipo de inseminacion (pie) ---
    const tipoPie = await sequelize.query(`
      SELECT tipo_inseminacion AS tipo, COUNT(*) AS cantidad
      FROM public."INSEMINACION"
      WHERE EXTRACT(YEAR FROM fecha) = :anio
      GROUP BY tipo_inseminacion
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: fase de embarazos activos ---
    const faseEmbarazos = await sequelize.query(`
      SELECT fase, COUNT(*) AS cantidad
      FROM public."EMBARAZO" e
      WHERE NOT EXISTS (
        SELECT 1 FROM public."PARTO" p WHERE p.id_embarazo = e.id_embarazo
      )
      GROUP BY fase
    `, { type: QueryTypes.SELECT });

    res.json({
      kpis: {
        embarazos_activos: Number(embarazosActivos[0].activos),
        total_partos:      Number(partos[0].total_partos),
        total_crias:       Number(partos[0].total_crias),
        inseminaciones_exitosas: exitosas,
        inseminaciones_fallidas: Number(totalesInsem[0].fallidas),
        total_inseminaciones:    total,
        tasa_exito:              Number(tasaExito),
      },
      graficas: {
        funnel,
        por_veterinario: porVeterinario,
        nacimientos_mes: nacimientosMes,
        tipo_pie:        tipoPie,
        fase_embarazos:  faseEmbarazos,
      },
    });
  } catch (error) {
    console.error("[dashboard/reproduccion]", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboardReproduccion };