const { sequelize } = require("../../../CORE/DATABASE/sequelize");
const { QueryTypes } = require("sequelize");
 
const getDashboardVentas = async (req, res) => {
  try {
    const mes  = req.query.mes  || new Date().getMonth() + 1;
    const anio = req.query.anio || new Date().getFullYear();
 
    // --- KPI: total vendido en el mes ---
    const totalMes = await sequelize.query(`
      SELECT
        COALESCE(SUM(dv.total), 0)                                          AS total_mes,
        COUNT(DISTINCT v.id_venta)                                          AS num_ventas,
        SUM(CASE WHEN dv.estatus = 'pendiente' THEN dv.total ELSE 0 END)   AS pendiente_cobro,
        COUNT(CASE WHEN dv.estatus = 'pendiente' THEN 1 END)               AS facturas_pendientes
      FROM public."VENTA" v
      JOIN public."DETALLE_VENTA" dv ON dv.id_venta = v.id_venta
      WHERE EXTRACT(MONTH FROM v.fecha) = :mes
        AND EXTRACT(YEAR  FROM v.fecha) = :anio
        AND v.estado = 'activo'
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });
 
    // --- KPI: producto mas vendido ---
    const productoTop = await sequelize.query(`
      SELECT p.tipo_producto, SUM(dv.total) AS total
      FROM public."DETALLE_VENTA" dv
      JOIN public."VENTA" v        ON v.id_venta    = dv.id_venta
      JOIN public."PRODUCTO" p     ON p.id_producto = dv.id_producto
      WHERE EXTRACT(MONTH FROM v.fecha) = :mes
        AND EXTRACT(YEAR  FROM v.fecha) = :anio
        AND v.estado = 'activo'
      GROUP BY p.tipo_producto
      ORDER BY total DESC
      LIMIT 1
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });
 
    // --- KPI: producto menos vendido ---
    const productoMenos = await sequelize.query(`
      SELECT p.tipo_producto, SUM(dv.total) AS total
      FROM public."DETALLE_VENTA" dv
      JOIN public."VENTA" v        ON v.id_venta    = dv.id_venta
      JOIN public."PRODUCTO" p     ON p.id_producto = dv.id_producto
      WHERE EXTRACT(MONTH FROM v.fecha) = :mes
        AND EXTRACT(YEAR  FROM v.fecha) = :anio
        AND v.estado = 'activo'
      GROUP BY p.tipo_producto
      ORDER BY total ASC
      LIMIT 1
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });
 
    // --- KPI: cliente que mas compra ---
    const clienteTop = await sequelize.query(`
      SELECT c.nombre, SUM(dv.total) AS total
      FROM public."VENTA" v
      JOIN public."DETALLE_VENTA" dv ON dv.id_venta  = v.id_venta
      JOIN public."CLIENTE" c        ON c.id_cliente = v.id_cliente
      WHERE EXTRACT(MONTH FROM v.fecha) = :mes
        AND EXTRACT(YEAR  FROM v.fecha) = :anio
        AND v.estado = 'activo'
      GROUP BY c.nombre
      ORDER BY total DESC
      LIMIT 1
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });
 
    // --- GRAFICA: ventas por producto (barras) ---
    const porProducto = await sequelize.query(`
      SELECT p.tipo_producto AS producto, SUM(dv.total) AS total
      FROM public."DETALLE_VENTA" dv
      JOIN public."VENTA" v    ON v.id_venta    = dv.id_venta
      JOIN public."PRODUCTO" p ON p.id_producto = dv.id_producto
      WHERE EXTRACT(MONTH FROM v.fecha) = :mes
        AND EXTRACT(YEAR  FROM v.fecha) = :anio
        AND v.estado = 'activo'
      GROUP BY p.tipo_producto
      ORDER BY total DESC
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });
 
    // --- GRAFICA: ventas por mes 2 años (linea) ---
    const comparativaAnual = await sequelize.query(`
      SELECT
        EXTRACT(MONTH FROM v.fecha)::INT AS mes,
        EXTRACT(YEAR  FROM v.fecha)::INT AS anio,
        SUM(dv.total)                    AS total
      FROM public."VENTA" v
      JOIN public."DETALLE_VENTA" dv ON dv.id_venta = v.id_venta
      WHERE EXTRACT(YEAR FROM v.fecha) IN (:anio, :anioAnterior)
        AND v.estado = 'activo'
      GROUP BY anio, mes
      ORDER BY anio, mes
    `, { replacements: { anio, anioAnterior: Number(anio) - 1 }, type: QueryTypes.SELECT });
 
    // --- GRAFICA: estado de ventas (pie) ---
    const estadoPie = await sequelize.query(`
      SELECT dv.estatus AS estado, SUM(dv.total) AS total, COUNT(*) AS cantidad
      FROM public."DETALLE_VENTA" dv
      JOIN public."VENTA" v ON v.id_venta = dv.id_venta
      WHERE EXTRACT(MONTH FROM v.fecha) = :mes
        AND EXTRACT(YEAR  FROM v.fecha) = :anio
        AND v.estado = 'activo'
      GROUP BY dv.estatus
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });
 
    // --- TABLA: clientes por provincia ---
    const porProvincia = await sequelize.query(`
      SELECT
        c.id_provincia,
        COUNT(DISTINCT v.id_cliente) AS clientes,
        SUM(dv.total)                AS total_ventas
      FROM public."VENTA" v
      JOIN public."DETALLE_VENTA" dv ON dv.id_venta  = v.id_venta
      JOIN public."CLIENTE" c        ON c.id_cliente = v.id_cliente
      WHERE EXTRACT(MONTH FROM v.fecha) = :mes
        AND EXTRACT(YEAR  FROM v.fecha) = :anio
        AND v.estado = 'activo'
      GROUP BY c.id_provincia
      ORDER BY total_ventas DESC
    `, { replacements: { mes, anio }, type: QueryTypes.SELECT });
 
    res.json({
      kpis: {
        total_mes:           Number(totalMes[0].total_mes),
        num_ventas:          Number(totalMes[0].num_ventas),
        pendiente_cobro:     Number(totalMes[0].pendiente_cobro),
        facturas_pendientes: Number(totalMes[0].facturas_pendientes),
        producto_top:        productoTop[0]  || null,
        producto_menos:      productoMenos[0] || null,
        cliente_top:         clienteTop[0]   || null,
      },
      graficas: {
        por_producto:      porProducto,
        comparativa_anual: comparativaAnual,
        estado_pie:        estadoPie,
        por_provincia:     porProvincia,
      },
    });
  } catch (error) {
    console.error("[dashboard/ventas]", error.message);
    res.status(500).json({ error: error.message });
  }
};
 
module.exports = { getDashboardVentas };