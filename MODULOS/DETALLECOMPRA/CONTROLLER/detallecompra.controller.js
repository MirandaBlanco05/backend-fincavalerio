const { DetalleCompra, MetodoPago } = require("../MODEL");
const CompraProveedor = require("../../COMPRA/MODEL/compra.model");
const Insumo          = require("../../INSUMO/MODEL/insumo.model");
const Empleado        = require("../../EMPLEADO/MODEL/empleado.model");

/* ══ LISTAR POR COMPRA ══ */
exports.listarPorCompra = async (req, res) => {
  try {
    const { id_compra } = req.params;
    const detalles = await DetalleCompra.findAll({
      where: { id_compra },
      include: [
        { model: Insumo,    as: "insumo",   attributes: ["nombre", "uso", "precio"] },
        { model: MetodoPago, as: "metodo",  attributes: ["tipo_metodo"] },
        { model: Empleado,  as: "empleado", attributes: ["nombre"] }
      ]
    });
    res.json(detalles);
  } catch (error) {
    console.error("ERROR LISTAR DETALLE_COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ CREAR — valida y sube stock ══ */
exports.crear = async (req, res) => {
  try {
    const { id_compra, id_metodo, id_empleado, insumos } = req.body;

    if (!id_compra || !id_metodo || !id_empleado || !insumos?.length) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Verificar que la compra existe
    const compra = await CompraProveedor.findByPk(id_compra);
    if (!compra) return res.status(404).json({ error: "Compra no encontrada" });

    // Insertar detalle y subir stock
    for (const i of insumos) {
      const insumo = await Insumo.findByPk(i.id_insumo);
      if (!insumo) return res.status(404).json({ error: `Insumo ${i.id_insumo} no encontrado` });

      await DetalleCompra.upsert({
        id_compra,
        id_insumo:       i.id_insumo,
        id_metodo,
        id_empleado,
        cantidad:        i.cantidad,
        precio_unitario: i.precio_unitario,
        monto_total:     i.cantidad * i.precio_unitario,
        estado:          "activo"
      });

      // Subir stock del insumo
      await insumo.update({ cantidad_stock: insumo.cantidad_stock + i.cantidad });
    }

    res.status(201).json({ mensaje: "Detalle de compra guardado y stock actualizado correctamente" });
  } catch (error) {
    console.error("ERROR CREAR DETALLE_COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ ACTUALIZAR — ajusta stock ══ */
exports.actualizar = async (req, res) => {
  try {
    const { id_compra } = req.params;
    const { id_metodo, id_empleado, insumos } = req.body;

    // Restaurar stock anterior (restar lo que se había subido)
    const anteriores = await DetalleCompra.findAll({ where: { id_compra } });
    for (const det of anteriores) {
      const insumo = await Insumo.findByPk(det.id_insumo);
      if (insumo) await insumo.update({ cantidad_stock: insumo.cantidad_stock - det.cantidad });
    }

    // Upsert con nuevos datos y subir nuevo stock
    for (const i of insumos) {
      const insumo = await Insumo.findByPk(i.id_insumo);
      if (!insumo) return res.status(404).json({ error: `Insumo ${i.id_insumo} no encontrado` });

      await DetalleCompra.upsert({
        id_compra:       parseInt(id_compra),
        id_insumo:       i.id_insumo,
        id_metodo,
        id_empleado,
        cantidad:        i.cantidad,
        precio_unitario: i.precio_unitario,
        monto_total:     i.cantidad * i.precio_unitario,
        estado:          "activo"
      });

      await insumo.update({ cantidad_stock: insumo.cantidad_stock + i.cantidad });
    }

    res.json({ mensaje: "Detalle de compra actualizado correctamente" });
  } catch (error) {
    console.error("ERROR ACTUALIZAR DETALLE_COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ DESACTIVAR — baja stock ══ */
exports.desactivar = async (req, res) => {
  try {
    const { id_compra } = req.params;
    const detalles = await DetalleCompra.findAll({ where: { id_compra } });

    if (!detalles.length) {
      return res.status(404).json({ error: "No se encontraron detalles para esta compra" });
    }

    for (const det of detalles) {
      const insumo = await Insumo.findByPk(det.id_insumo);
      if (insumo) await insumo.update({ cantidad_stock: insumo.cantidad_stock - det.cantidad });

      await DetalleCompra.update(
        { estado: "inactivo" },
        { where: { id_compra: det.id_compra, id_insumo: det.id_insumo } }
      );
    }

    res.json({ mensaje: "Compra desactivada y stock ajustado correctamente" });
  } catch (error) {
    console.error("ERROR DESACTIVAR DETALLE_COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};