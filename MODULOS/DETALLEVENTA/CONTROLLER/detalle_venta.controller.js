const { DetalleVenta } = require("../MODEL");
const Venta    = require("../../VENTA/MODEL/venta.model");
const Producto = require("../../PRODUCTO/MODEL/producto.model");
const MetodoPago = require("../../METODOPAGO/MODEL/metodo.model");

/* LISTAR POR VENTA */
exports.listarPorVenta = async (req, res) => {
  try {
    const { id_venta } = req.params;
    const detalles = await DetalleVenta.findAll({
      where: { id_venta },
      include: [
        { model: Producto,   as: "producto",  attributes: ["tipo_producto", "descripcion", "precio_venta", "cantidad_stock"] },
        { model: MetodoPago, as: "metodo",    attributes: ["tipo_metodo"] }
      ]
    });
    res.json(detalles);
  } catch (error) {
    console.error("ERROR LISTAR DETALLE:", error);
    res.status(500).json({ error: error.message });
  }
};

/* CREAR — valida y descuenta stock */
exports.crear = async (req, res) => {
  try {
    const { id_venta, id_metodo, productos } = req.body;

    if (!id_venta || !id_metodo || !productos?.length) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Validar stock
    for (const p of productos) {
      const prod = await Producto.findByPk(p.id_producto);
      if (!prod) return res.status(404).json({ error: `Producto ${p.id_producto} no encontrado` });
      if (prod.cantidad_stock < p.cantidad) {
        return res.status(400).json({
          error: `Stock insuficiente para "${prod.tipo_producto}". Disponible: ${prod.cantidad_stock}`
        });
      }
    }

    // Insertar detalle
    const detalles = productos.map(p => ({
      id_venta,
      id_producto:     p.id_producto,
      id_metodo,
      cantidad:        p.cantidad,
      precio_unitario: p.precio_unitario,
      total:           p.cantidad * p.precio_unitario,
      estatus:         "activo",
      estado:          "activo"
    }));

    await DetalleVenta.bulkCreate(detalles);

    // Descontar stock
    for (const p of productos) {
      const prod = await Producto.findByPk(p.id_producto);
      await prod.update({ cantidad_stock: prod.cantidad_stock - p.cantidad });
    }

    res.status(201).json({ mensaje: "Detalle guardado y stock actualizado correctamente" });
  } catch (error) {
    console.error("ERROR CREAR DETALLE:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ACTUALIZAR — restaura stock anterior y aplica el nuevo */
exports.actualizar = async (req, res) => {
  try {
    const { id_venta } = req.params;
    const { id_metodo, productos } = req.body;

    // Restaurar stock anterior
    const anteriores = await DetalleVenta.findAll({ where: { id_venta } });
    for (const det of anteriores) {
      const prod = await Producto.findByPk(det.id_producto);
      if (prod) await prod.update({ cantidad_stock: prod.cantidad_stock + det.cantidad });
    }

    // Validar nuevo stock
    for (const p of productos) {
      const prod = await Producto.findByPk(p.id_producto);
      if (!prod) return res.status(404).json({ error: `Producto ${p.id_producto} no encontrado` });
      if (prod.cantidad_stock < p.cantidad) {
        // Revertir restauración
        for (const det of anteriores) {
          const r = await Producto.findByPk(det.id_producto);
          if (r) await r.update({ cantidad_stock: r.cantidad_stock - det.cantidad });
        }
        return res.status(400).json({
          error: `Stock insuficiente para "${prod.tipo_producto}". Disponible: ${prod.cantidad_stock}`
        });
      }
    }

    // Upsert cada producto — actualiza si existe, inserta si no
    for (const p of productos) {
      await DetalleVenta.upsert({
        id_venta:        parseInt(id_venta),
        id_producto:     p.id_producto,
        id_metodo,
        cantidad:        p.cantidad,
        precio_unitario: p.precio_unitario,
        total:           p.cantidad * p.precio_unitario,
        estatus:         "activo",
        estado:          "activo"
      });
    }

    // Descontar nuevo stock
    for (const p of productos) {
      const prod = await Producto.findByPk(p.id_producto);
      await prod.update({ cantidad_stock: prod.cantidad_stock - p.cantidad });
    }

    res.json({ mensaje: "Detalle actualizado correctamente" });
  } catch (error) {
    console.error("ERROR ACTUALIZAR DETALLE:", error);
    res.status(500).json({ error: error.message });
  }
};
/* DESACTIVAR — restaura stock */
exports.desactivar = async (req, res) => {
  try {
    const { id_venta } = req.params;
    const detalles = await DetalleVenta.findAll({ where: { id_venta } });

    for (const det of detalles) {
      const prod = await Producto.findByPk(det.id_producto);
      if (prod) await prod.update({ cantidad: prod.cantidad_stock + det.cantidad });
    }

    await DetalleVenta.update(
      { estado: "inactivo", estatus: "inactivo" },
      { where: { id_venta } }
    );

    res.json({ mensaje: "Venta desactivada y stock restaurado correctamente" });
  } catch (error) {
    console.error("ERROR DESACTIVAR DETALLE:", error);
    res.status(500).json({ error: error.message });
  }
};