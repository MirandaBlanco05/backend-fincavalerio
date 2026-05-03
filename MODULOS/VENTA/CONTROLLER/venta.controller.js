const { Venta, Cliente, SecuenciaNcf, ComprobanteFiscal } = require("../MODEL");

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
        { model: Cliente, as: "cliente", attributes: ["nombre", "rnc"] },
        {
          model: SecuenciaNcf, as: "secuencia", attributes: ["secuencia", "estado"],
          include: [{ model: ComprobanteFiscal, as: "comprobante", attributes: ["nombre", "tipo", "serie"] }]
        }
      ],
      order: [["fecha", "DESC"]]
    });

    const resultado = ventas.map(v => ({
      ...v.toJSON(),
      ncf_completo: construirNcf(v.secuencia)
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
        { model: Cliente, as: "cliente", attributes: ["nombre", "rnc", "telefono"] },
        {
          model: SecuenciaNcf, as: "secuencia", attributes: ["secuencia", "estado"],
          include: [{ model: ComprobanteFiscal, as: "comprobante", attributes: ["nombre", "tipo", "serie"] }]
        }
      ]
    });
    if (!venta) return res.status(404).json({ error: "Venta no encontrada" });

    res.json({
      ...venta.toJSON(),
      ncf_completo: construirNcf(venta.secuencia)
    });
  } catch (error) {
    console.error("ERROR OBTENER VENTA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ CREAR ══ */
exports.crear = async (req, res) => {
  try {
    const { id_cliente, fecha, concepto, ncf, estado } = req.body;

    if (!id_cliente) return res.status(400).json({ error: "El cliente es obligatorio" });
    if (!fecha)      return res.status(400).json({ error: "La fecha es obligatoria" });

    const venta = await Venta.create({
      id_cliente,
      fecha,
      concepto: concepto?.trim() || null,
      ncf:      ncf ? parseInt(ncf) : null,
      estado:   estado || "activo"
    });

    // Marcar secuencia como Usado
    if (ncf) {
      await SecuenciaNcf.update(
        { estado: "Usado" },
        { where: { id_secuencia: parseInt(ncf) } }
      );
    }

    res.status(201).json({ mensaje: "Venta registrada correctamente", venta });
  } catch (error) {
    console.error("ERROR CREAR VENTA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ ACTUALIZAR ══ */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_cliente, fecha, concepto, ncf, estado } = req.body;

    const venta = await Venta.findByPk(id);
    if (!venta) return res.status(404).json({ error: "Venta no encontrada" });

    // Si cambió el NCF restaurar el anterior y marcar el nuevo como Usado
    if (ncf && parseInt(ncf) !== venta.ncf) {
      if (venta.ncf) {
        await SecuenciaNcf.update(
          { estado: "Disponible" },
          { where: { id_secuencia: venta.ncf } }
        );
      }
      await SecuenciaNcf.update(
        { estado: "Usado" },
        { where: { id_secuencia: parseInt(ncf) } }
      );
    }

    await venta.update({
      id_cliente: id_cliente       ?? venta.id_cliente,
      fecha:      fecha            ?? venta.fecha,
      concepto:   concepto?.trim() ?? venta.concepto,
      ncf:        ncf ? parseInt(ncf) : venta.ncf,
      estado:     estado           ?? venta.estado
    });

    res.json({ mensaje: "Venta actualizada correctamente", venta });
  } catch (error) {
    console.error("ERROR ACTUALIZAR VENTA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ ELIMINAR — restaura la secuencia a Disponible ══ */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);
    if (!venta) return res.status(404).json({ error: "Venta no encontrada" });

    if (venta.ncf) {
      await SecuenciaNcf.update(
        { estado: "Disponible" },
        { where: { id_secuencia: venta.ncf } }
      );
    }

    await venta.destroy();
    res.json({ mensaje: "Venta eliminada correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR VENTA:", error);
    res.status(500).json({ error: error.message });
  }
};