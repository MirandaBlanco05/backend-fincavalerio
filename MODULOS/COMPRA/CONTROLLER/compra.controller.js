const { CompraProveedor, Proveedor, SecuenciaNcf, ComprobanteFiscal, Provincia } = require("../MODEL");
const { DetalleCompra } = require("../../DETALLECOMPRA/MODEL");
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
    const compras = await CompraProveedor.findAll({
      include: [
        { 
          model: Proveedor, 
          as: "proveedor", 
          attributes: ["nombre", "rnc", "telefono"],
          include: [{ model: Provincia, as: "provincia", attributes: ["nombre"] }]
        },
        {
          model: SecuenciaNcf, as: "secuencia", attributes: ["id_secuencia", "secuencia", "estado"],
          include: [{ model: ComprobanteFiscal, as: "comprobante", attributes: ["nombre", "tipo", "serie"] }]
        },
        {
          model: DetalleCompra, as: "detalles",
          include: ["insumo"]
        }
      ],
      order: [["id_compra", "DESC"]]
    });

    const resultado = compras.map(c => ({
      ...c.toJSON(),
      ncf_completo: construirNcf(c.secuencia),
      productos_compra: c.detalles // Mapeo para el frontend
    }));

    res.json(resultado);
  } catch (error) {
    console.error("ERROR LISTAR COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ OBTENER POR ID ══ */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await CompraProveedor.findByPk(id, {
      include: [
        { 
          model: Proveedor, 
          as: "proveedor", 
          include: [{ model: Provincia, as: "provincia", attributes: ["nombre"] }]
        },
        {
          model: SecuenciaNcf, as: "secuencia",
          include: [{ model: ComprobanteFiscal, as: "comprobante" }]
        },
        {
          model: DetalleCompra, as: "detalles",
          include: ["insumo"]
        }
      ]
    });
    if (!compra) return res.status(404).json({ error: "Compra no encontrada" });

    res.json({
      ...compra.toJSON(),
      ncf_completo: construirNcf(compra.secuencia),
      productos_compra: compra.detalles
    });
  } catch (error) {
    console.error("ERROR OBTENER COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ CREAR ══ */
exports.crear = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_proveedor, fecha, ncf, productos, metodo_pago } = req.body;

    if (!id_proveedor) throw new Error("El proveedor es obligatorio");
    if (!fecha)        throw new Error("La fecha es obligatoria");

    const compra = await CompraProveedor.create({
      id_proveedor,
      fecha,
      ncf: ncf ? parseInt(ncf) : null,
      metodo_pago: metodo_pago || "Efectivo"
    }, { transaction: t });

    // Guardar detalles
    if (productos && productos.length > 0) {
      const detalles = productos.map(p => ({
        id_compra: compra.id_compra,
        id_insumo: p.id_item || p.id_insumo,
        id_metodo: 1, // Default o buscar por nombre
        cantidad: p.cantidad,
        precio_unitario: p.precio || p.precio_unitario,
        monto_total: (p.cantidad * (p.precio || p.precio_unitario)),
        id_empleado: 1, // Requerido por el modelo
        estado: "activo"
      }));
      await DetalleCompra.bulkCreate(detalles, { transaction: t });
    }

    // Marcar secuencia como Usado
    if (ncf) {
      await SecuenciaNcf.update(
        { estado: "Usado" },
        { where: { id_secuencia: parseInt(ncf) }, transaction: t }
      );
    }

    await t.commit();
    res.status(201).json({ mensaje: "Compra registrada correctamente", compra });
  } catch (error) {
    await t.rollback();
    console.error("ERROR CREAR COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ ACTUALIZAR ══ */
exports.actualizar = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { id_proveedor, fecha, ncf, productos, metodo_pago } = req.body;

    const compra = await CompraProveedor.findByPk(id);
    if (!compra) throw new Error("Compra no encontrada");

    // Manejo de NCF
    if (ncf && parseInt(ncf) !== compra.ncf) {
      if (compra.ncf) {
        await SecuenciaNcf.update({ estado: "Disponible" }, { where: { id_secuencia: compra.ncf }, transaction: t });
      }
      await SecuenciaNcf.update({ estado: "Usado" }, { where: { id_secuencia: parseInt(ncf) }, transaction: t });
    }

    await compra.update({
      id_proveedor: id_proveedor ?? compra.id_proveedor,
      fecha:        fecha        ?? compra.fecha,
      ncf:          ncf ? parseInt(ncf) : compra.ncf,
      metodo_pago:  metodo_pago  ?? compra.metodo_pago
    }, { transaction: t });

    // Actualizar detalles (Borrar y re-crear es lo más limpio para detalles dinámicos)
    if (productos) {
      await DetalleCompra.destroy({ where: { id_compra: id }, transaction: t });
      const detalles = productos.map(p => ({
        id_compra: id,
        id_insumo: p.id_item || p.id_insumo || p.id_producto,
        id_metodo: 1,
        cantidad: p.cantidad,
        precio_unitario: p.precio || p.precio_unitario,
        monto_total: (p.cantidad * (p.precio || p.precio_unitario)),
        id_empleado: 1,
        estado: "activo"
      }));
      await DetalleCompra.bulkCreate(detalles, { transaction: t });
    }

    await t.commit();
    res.json({ mensaje: "Compra actualizada correctamente", compra });
  } catch (error) {
    await t.rollback();
    console.error("ERROR ACTUALIZAR COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ ELIMINAR ══ */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await CompraProveedor.findByPk(id);
    if (!compra) return res.status(404).json({ error: "Compra no encontrada" });

    if (compra.ncf) {
      await SecuenciaNcf.update({ estado: "Disponible" }, { where: { id_secuencia: compra.ncf } });
    }

    await DetalleCompra.destroy({ where: { id_compra: id } });
    await compra.destroy();
    res.json({ mensaje: "Compra eliminada correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};