const { Venta, Cliente, SecuenciaNcf, ComprobanteFiscal } = require("../MODEL");
const { DetalleVenta } = require("../../DETALLEVENTA/MODEL");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

/* ══ CONSTRUIR NCF COMPLETO ══ */
function construirNcf(secuencia) {
  if (!secuencia || !secuencia.comprobante) return null;
  const serie  = secuencia.comprobante.serie;
  const tipo   = String(secuencia.comprobante.tipo).padStart(2, "0");
  const numero = String(secuencia.secuencia).padStart(8, "0");
  return `${serie}${tipo}${numero}`;
}

/* ══ LISTAR ══ */
exports.listar = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        { model: Cliente, as: "cliente", attributes: ["nombre", "rnc", "telefono"] },
        {
          model: SecuenciaNcf, as: "secuencia", attributes: ["id_secuencia", "secuencia", "estado"],
          include: [{ model: ComprobanteFiscal, as: "comprobante", attributes: ["nombre", "tipo", "serie"] }]
        },
        {
          model: DetalleVenta, as: "detalles",
          include: ["producto"]
        }
      ],
      order: [["id_venta", "DESC"]]
    });

    const resultado = ventas.map(v => ({
      ...v.toJSON(),
      ncf_completo: construirNcf(v.secuencia),
      productos_venta: v.detalles // Mapeo para el frontend
    }));

    res.json(resultado);
  } catch (error) {
    console.error("ERROR LISTAR VENTA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ OBTENER POR ID ══ */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id, {
      include: [
        { model: Cliente, as: "cliente" },
        {
          model: SecuenciaNcf, as: "secuencia",
          include: [{ model: ComprobanteFiscal, as: "comprobante" }]
        },
        {
          model: DetalleVenta, as: "detalles",
          include: ["producto"]
        }
      ]
    });
    if (!venta) return res.status(404).json({ error: "Venta no encontrada" });

    res.json({
      ...venta.toJSON(),
      ncf_completo: construirNcf(venta.secuencia),
      productos_venta: venta.detalles
    });
  } catch (error) {
    console.error("ERROR OBTENER VENTA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ CREAR ══ */
exports.crear = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_cliente, fecha, concepto, ncf, estado, productos, metodo_pago } = req.body;

    if (!id_cliente) throw new Error("El cliente es obligatorio");
    if (!fecha)      throw new Error("La fecha es obligatoria");

    const venta = await Venta.create({
      id_cliente,
      fecha,
      concepto: concepto?.trim() || null,
      ncf:      ncf ? parseInt(ncf) : null,
      metodo_pago: metodo_pago || "Efectivo",
      estado:   estado || "activo"
    }, { transaction: t });

    // Guardar detalles
    if (productos && productos.length > 0) {
      const detalles = productos.map(p => ({
        id_venta: venta.id_venta,
        id_producto: p.id_producto || p.id_item,
        id_metodo: 1, // Default
        cantidad: p.cantidad,
        precio_unitario: p.precio || p.precio_unitario,
        total: (p.cantidad * (p.precio || p.precio_unitario)),
        estado: "activo"
      }));
      await DetalleVenta.bulkCreate(detalles, { transaction: t });
    }

    // Marcar secuencia como Usado
    if (ncf) {
      await SecuenciaNcf.update(
        { estado: "Usado" },
        { where: { id_secuencia: parseInt(ncf) }, transaction: t }
      );
    }

    await t.commit();
    res.status(201).json({ mensaje: "Venta registrada correctamente", venta });
  } catch (error) {
    await t.rollback();
    console.error("ERROR CREAR VENTA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ ACTUALIZAR ══ */
exports.actualizar = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { id_cliente, fecha, concepto, ncf, estado, productos, metodo_pago } = req.body;

    const venta = await Venta.findByPk(id);
    if (!venta) throw new Error("Venta no encontrada");

    // NCF logic
    if (ncf && parseInt(ncf) !== venta.ncf) {
      if (venta.ncf) {
        await SecuenciaNcf.update({ estado: "Disponible" }, { where: { id_secuencia: venta.ncf }, transaction: t });
      }
      await SecuenciaNcf.update({ estado: "Usado" }, { where: { id_secuencia: parseInt(ncf) }, transaction: t });
    }

    await venta.update({
      id_cliente: id_cliente       ?? venta.id_cliente,
      fecha:      fecha            ?? venta.fecha,
      concepto:   concepto?.trim() ?? venta.concepto,
      ncf:        ncf ? parseInt(ncf) : venta.ncf,
      metodo_pago: metodo_pago     ?? venta.metodo_pago,
      estado:     estado           ?? venta.estado
    }, { transaction: t });

    // Actualizar detalles
    if (productos) {
      await DetalleVenta.destroy({ where: { id_venta: id }, transaction: t });
      const detalles = productos.map(p => ({
        id_venta: id,
        id_producto: p.id_producto || p.id_item,
        id_metodo: 1,
        cantidad: p.cantidad,
        precio_unitario: p.precio || p.precio_unitario,
        total: (p.cantidad * (p.precio || p.precio_unitario)),
        estado: "activo"
      }));
      await DetalleVenta.bulkCreate(detalles, { transaction: t });
    }

    await t.commit();
    res.json({ mensaje: "Venta actualizada correctamente", venta });
  } catch (error) {
    await t.rollback();
    console.error("ERROR ACTUALIZAR VENTA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ ELIMINAR ══ */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);
    if (!venta) return res.status(404).json({ error: "Venta no encontrada" });

    if (venta.ncf) {
      await SecuenciaNcf.update({ estado: "Disponible" }, { where: { id_secuencia: venta.ncf } });
    }

    await DetalleVenta.destroy({ where: { id_venta: id } });
    await venta.destroy();
    res.json({ mensaje: "Venta eliminada correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR VENTA:", error);
    res.status(500).json({ error: error.message });
  }
};