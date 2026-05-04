const { CompraProveedor, Proveedor, SecuenciaNcf, ComprobanteFiscal } = require("../MODEL");

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
        { model: Proveedor, as: "proveedor", attributes: ["nombre", "rnc"] },
        {
          model: SecuenciaNcf, as: "secuencia", attributes: ["secuencia", "estado"],
          include: [{ model: ComprobanteFiscal, as: "comprobante", attributes: ["nombre", "tipo", "serie"] }]
        }
      ],
      order: [["fecha", "DESC"]]
    });

    const resultado = compras.map(c => ({
      ...c.toJSON(),
      ncf_completo: construirNcf(c.secuencia)
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
        { model: Proveedor, as: "proveedor", attributes: ["nombre", "rnc", "telefono"] },
        {
          model: SecuenciaNcf, as: "secuencia", attributes: ["secuencia", "estado"],
          include: [{ model: ComprobanteFiscal, as: "comprobante", attributes: ["nombre", "tipo", "serie"] }]
        }
      ]
    });
    if (!compra) return res.status(404).json({ error: "Compra no encontrada" });

    res.json({
      ...compra.toJSON(),
      ncf_completo: construirNcf(compra.secuencia)
    });
  } catch (error) {
    console.error("ERROR OBTENER COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ CREAR ══ */
exports.crear = async (req, res) => {
  try {
    const { id_proveedor, fecha, ncf } = req.body;

    if (!id_proveedor) return res.status(400).json({ error: "El proveedor es obligatorio" });
    if (!fecha)        return res.status(400).json({ error: "La fecha es obligatoria" });

    const compra = await CompraProveedor.create({
      id_proveedor,
      fecha,
      ncf: ncf ? parseInt(ncf) : null
    });

    // Marcar secuencia como Usado
    if (ncf) {
      await SecuenciaNcf.update(
        { estado: "Usado" },
        { where: { id_secuencia: parseInt(ncf) } }
      );
    }

    res.status(201).json({ mensaje: "Compra registrada correctamente", compra });
  } catch (error) {
    console.error("ERROR CREAR COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ ACTUALIZAR ══ */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_proveedor, fecha, ncf } = req.body;

    const compra = await CompraProveedor.findByPk(id);
    if (!compra) return res.status(404).json({ error: "Compra no encontrada" });

    // Si cambió el NCF restaurar el anterior y marcar el nuevo como Usado
    if (ncf && parseInt(ncf) !== compra.ncf) {
      if (compra.ncf) {
        await SecuenciaNcf.update(
          { estado: "Disponible" },
          { where: { id_secuencia: compra.ncf } }
        );
      }
      await SecuenciaNcf.update(
        { estado: "Usado" },
        { where: { id_secuencia: parseInt(ncf) } }
      );
    }

    await compra.update({
      id_proveedor: id_proveedor ?? compra.id_proveedor,
      fecha:        fecha        ?? compra.fecha,
      ncf:          ncf ? parseInt(ncf) : compra.ncf
    });

    res.json({ mensaje: "Compra actualizada correctamente", compra });
  } catch (error) {
    console.error("ERROR ACTUALIZAR COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ ELIMINAR — restaura secuencia a Disponible ══ */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await CompraProveedor.findByPk(id);
    if (!compra) return res.status(404).json({ error: "Compra no encontrada" });

    if (compra.ncf) {
      await SecuenciaNcf.update(
        { estado: "Disponible" },
        { where: { id_secuencia: compra.ncf } }
      );
    }

    await compra.destroy();
    res.json({ mensaje: "Compra eliminada correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR COMPRA:", error);
    res.status(500).json({ error: error.message });
  }
};