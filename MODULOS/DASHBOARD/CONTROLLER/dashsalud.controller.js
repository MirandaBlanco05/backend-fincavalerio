const { sequelize } = require("../../../CORE/DATABASE/sequelize");
const { QueryTypes } = require("sequelize");

const getDashboardSalud = async (req, res) => {
  try {
    const anio = req.query.anio || new Date().getFullYear();

    // --- KPI: tratamientos activos (sin fecha_fin aun) ---
    const tratamientosActivos = await sequelize.query(`
      SELECT COUNT(*) AS activos
      FROM public."TRATAMIENTO"
      WHERE fecha_fin IS NULL
        AND EXTRACT(YEAR FROM fecha_inicio) = :anio
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- KPI: bovinos en tratamiento activo ---
    const bovinosEnfermos = await sequelize.query(`
      SELECT COUNT(DISTINCT mv.id_bovino) AS bovinos
      FROM public."MOTIVO_VISITA" mv
      JOIN public."VISITA" vi ON vi.id_visita = mv.id_visita
      WHERE EXTRACT(YEAR FROM vi.fecha) = :anio
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- KPI: enfermedad mas comun ---
    const enfermedadTop = await sequelize.query(`
      SELECT e.nombre, COUNT(*) AS casos
      FROM public."TRATAMIENTO" t
      JOIN public."ENFERMEDAD" e ON e.id_enfermedad = t.id_enfermedad
      WHERE EXTRACT(YEAR FROM t.fecha_inicio) = :anio
      GROUP BY e.nombre
      ORDER BY casos DESC
      LIMIT 1
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- KPI: insumo mas usado (via detalle_compra tipo veterinaria) ---
    const insumoTop = await sequelize.query(`
      SELECT i.nombre, SUM(dc.cantidad) AS cantidad_total
      FROM public."DETALLE_COMPRA" dc
      JOIN public."INSUMO" i            ON i.id_insumo  = dc.id_insumo
      JOIN public."COMPRA_PROVEEDOR" cp ON cp.id_compra = dc.id_compra
      WHERE i.tipo_insumo ILIKE '%veterinari%'
        AND EXTRACT(YEAR FROM cp.fecha) = :anio
      GROUP BY i.nombre
      ORDER BY cantidad_total DESC
      LIMIT 1
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: enfermedades mas frecuentes (barras) ---
    const enfermedades = await sequelize.query(`
      SELECT e.nombre, COUNT(*) AS casos
      FROM public."TRATAMIENTO" t
      JOIN public."ENFERMEDAD" e ON e.id_enfermedad = t.id_enfermedad
      WHERE EXTRACT(YEAR FROM t.fecha_inicio) = :anio
      GROUP BY e.nombre
      ORDER BY casos DESC
      LIMIT 10
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: tipos de tratamiento (pie) ---
    const tipoPie = await sequelize.query(`
      SELECT tipo_tratamiento, COUNT(*) AS cantidad
      FROM public."TRATAMIENTO"
      WHERE EXTRACT(YEAR FROM fecha_inicio) = :anio
        AND tipo_tratamiento IS NOT NULL
      GROUP BY tipo_tratamiento
      ORDER BY cantidad DESC
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: evolucion de casos por mes (linea) ---
    const evolucionMes = await sequelize.query(`
      SELECT
        EXTRACT(MONTH FROM t.fecha_inicio)::INT AS mes,
        COUNT(*) AS casos
      FROM public."TRATAMIENTO" t
      WHERE EXTRACT(YEAR FROM t.fecha_inicio) = :anio
      GROUP BY mes
      ORDER BY mes
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: bovinos con mas visitas (ranking) ---
    const rankingBovinos = await sequelize.query(`
      SELECT
        b.numero_crotal,
        b.nombre,
        COUNT(vi.id_visita) AS total_visitas
      FROM public."VISITA" vi
      JOIN public."BOVINO" b ON b.id_bovino = vi.id_bovino
      WHERE EXTRACT(YEAR FROM vi.fecha) = :anio
      GROUP BY b.id_bovino, b.numero_crotal, b.nombre
      ORDER BY total_visitas DESC
      LIMIT 10
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    res.json({
      kpis: {
        tratamientos_activos: Number(tratamientosActivos[0].activos),
        bovinos_enfermos:     Number(bovinosEnfermos[0].bovinos),
        enfermedad_top:       enfermedadTop[0] || null,
        insumo_top:           insumoTop[0]     || null,
      },
      graficas: {
        enfermedades,
        tipo_pie:        tipoPie,
        evolucion_mes:   evolucionMes,
        ranking_bovinos: rankingBovinos,
      },
    });
  } catch (error) {
    console.error("[dashboard/salud]", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboardSalud };