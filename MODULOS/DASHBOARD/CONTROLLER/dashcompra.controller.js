const { sequelize } = require("../../../CORE/DATABASE/sequelize");
const { QueryTypes } = require("sequelize");

const getDashboardCompras = async (req, res) => {
  try {
    const mes  = req.query.mes  || new Date().getMonth() + 1;
    const anio = req.query.anio || new Date().getFullYear();

    // --- KPI: total gastado en el mes ---
    const totalMes = await sequelize.query(`
      SELECT
        COALESCE(SUM(dc.monto_total), 0) AS total_gastado,
        COUNT(DISTINCT cp.id_compra)     AS num_compras
      FROM public."COMPRA_PROVEEDOR" cp
      JOIN public."DETALLE_COMPRA" dc ON dc.id_compra = cp.id_compra
      WHERE EXTRACT(MONTH FROM cp.fecha) = :mes
        AND EXTRACT(YEAR  FROM cp.fecha) = :anio
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    // --- KPI: proveedor mas usado ---
    const proveedorTop = await sequelize.query(`
      SELECT p.nombre, COUNT(DISTINCT cp.id_compra) AS ordenes, SUM(dc.monto_total) AS total
      FROM public."COMPRA_PROVEEDOR" cp
      JOIN public."DETALLE_COMPRA" dc ON dc.id_compra   = cp.id_compra
      JOIN public."PROVEEDOR" p       ON p.id_proveedor = cp.id_proveedor
      WHERE EXTRACT(MONTH FROM cp.fecha) = :mes
        AND EXTRACT(YEAR  FROM cp.fecha) = :anio
      GROUP BY p.nombre
      ORDER BY total DESC
      LIMIT 1
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    // --- KPI: insumo mas comprado ---
    const insumoTop = await sequelize.query(`
      SELECT i.nombre, SUM(dc.cantidad) AS cantidad_total, SUM(dc.monto_total) AS gasto
      FROM public."DETALLE_COMPRA" dc
      JOIN public."COMPRA_PROVEEDOR" cp ON cp.id_compra = dc.id_compra
      JOIN public."INSUMO" i            ON i.id_insumo  = dc.id_insumo
      WHERE EXTRACT(MONTH FROM cp.fecha) = :mes
        AND EXTRACT(YEAR  FROM cp.fecha) = :anio
      GROUP BY i.nombre
      ORDER BY gasto DESC
      LIMIT 1
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: compras por proveedor (barras) ---
    const porProveedor = await sequelize.query(`
      SELECT p.nombre, SUM(dc.monto_total) AS total
      FROM public."COMPRA_PROVEEDOR" cp
      JOIN public."DETALLE_COMPRA" dc ON dc.id_compra   = cp.id_compra
      JOIN public."PROVEEDOR" p       ON p.id_proveedor = cp.id_proveedor
      WHERE EXTRACT(MONTH FROM cp.fecha) = :mes
        AND EXTRACT(YEAR  FROM cp.fecha) = :anio
      GROUP BY p.nombre
      ORDER BY total DESC
      LIMIT 10
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: tipo de compra por tipo_proveedor (pie) ---
    const tipoPie = await sequelize.query(`
      SELECT p.tipo_proveedor AS categoria, SUM(dc.monto_total) AS total
      FROM public."COMPRA_PROVEEDOR" cp
      JOIN public."DETALLE_COMPRA" dc ON dc.id_compra   = cp.id_compra
      JOIN public."PROVEEDOR" p       ON p.id_proveedor = cp.id_proveedor
      WHERE EXTRACT(MONTH FROM cp.fecha) = :mes
        AND EXTRACT(YEAR  FROM cp.fecha) = :anio
      GROUP BY p.tipo_proveedor
      ORDER BY total DESC
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: gasto mensual del año (linea) ---
    const gastoMensual = await sequelize.query(`
      SELECT
        EXTRACT(MONTH FROM cp.fecha)::INT AS mes,
        SUM(dc.monto_total)               AS total
      FROM public."COMPRA_PROVEEDOR" cp
      JOIN public."DETALLE_COMPRA" dc ON dc.id_compra = cp.id_compra
      WHERE EXTRACT(YEAR FROM cp.fecha) = :anio
      GROUP BY mes
      ORDER BY mes
    `, { replacements: { anio }, type: QueryTypes.SELECT });

    // --- GRAFICA: top 10 insumos mas comprados ---
    const top10Insumos = await sequelize.query(`
      SELECT i.nombre, i.tipo_insumo, SUM(dc.monto_total) AS total, SUM(dc.cantidad) AS cantidad_total
      FROM public."DETALLE_COMPRA" dc
      JOIN public."COMPRA_PROVEEDOR" cp ON cp.id_compra = dc.id_compra
      JOIN public."INSUMO" i            ON i.id_insumo  = dc.id_insumo
      WHERE EXTRACT(MONTH FROM cp.fecha) = :mes
        AND EXTRACT(YEAR  FROM cp.fecha) = :anio
      GROUP BY i.nombre, i.tipo_insumo
      ORDER BY total DESC
      LIMIT 10
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });

    res.json({
      kpis: {
        total_gastado: Number(totalMes[0].total_gastado),
        num_compras:   Number(totalMes[0].num_compras),
        proveedor_top: proveedorTop[0] || null,
        insumo_top:    insumoTop[0]    || null,
      },
      graficas: {
        por_proveedor:  porProveedor,
        tipo_pie:       tipoPie,
        gasto_mensual:  gastoMensual,
        top10_insumos:  top10Insumos,
      },
    });
  } catch (error) {
    console.error("[dashboard/compras]", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboardCompras };