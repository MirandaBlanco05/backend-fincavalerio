const { SecuenciaNcf, ComprobanteFiscal } = require("../MODEL");

/* ══ CONSTRUIR NCF COMPLETO ══ */
function construirNcf(secuencia) {
  if (!secuencia || !secuencia.comprobante) return null;
  const serie  = secuencia.comprobante.serie;
  const tipo   = String(secuencia.comprobante.id_comprobante || 1).padStart(2, "0"); // O usar secuencia.comprobante.tipo si existe
  const numero = String(secuencia.secuencia).padStart(8, "0");
  return `${serie}${tipo}${numero}`;
}

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const secuencias = await SecuenciaNcf.findAll({
      include: [{ model: ComprobanteFiscal, as: "comprobante" }],
      order: [["id_secuencia", "ASC"]]
    });
    
    const resultado = secuencias.map(s => ({
      ...s.toJSON(),
      ncf_completo: construirNcf(s)
    }));

    res.json(resultado);
  } catch (error) {
    console.error("ERROR LISTAR SECUENCIA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* OBTENER POR ID */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const secuencia = await SecuenciaNcf.findByPk(id, {
      include: [{ model: ComprobanteFiscal, as: "comprobante" }]
    });
    if (!secuencia) return res.status(404).json({ error: "Secuencia no encontrada" });
    
    res.json({
      ...secuencia.toJSON(),
      ncf_completo: construirNcf(secuencia)
    });
  } catch (error) {
    console.error("ERROR OBTENER SECUENCIA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* CREAR */
exports.crear = async (req, res) => {
  try {
    const { id_comprobante, secuencia, estado } = req.body;

    if (!id_comprobante) return res.status(400).json({ error: "El comprobante es obligatorio" });
    if (secuencia === undefined) return res.status(400).json({ error: "La secuencia es obligatoria" });

    const nueva = await SecuenciaNcf.create({
      id_comprobante,
      secuencia,
      estado: estado || "Disponible"
    });

    res.status(201).json({ mensaje: "Secuencia registrada correctamente", secuencia: nueva });
  } catch (error) {
    console.error("ERROR CREAR SECUENCIA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ACTUALIZAR */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_comprobante, secuencia, estado } = req.body;

    const registro = await SecuenciaNcf.findByPk(id);
    if (!registro) return res.status(404).json({ error: "Secuencia no encontrada" });

    await registro.update({
      id_comprobante: id_comprobante ?? registro.id_comprobante,
      secuencia:      secuencia      ?? registro.secuencia,
      estado:         estado         ?? registro.estado
    });

    res.json({ mensaje: "Secuencia actualizada correctamente", secuencia: registro });
  } catch (error) {
    console.error("ERROR ACTUALIZAR SECUENCIA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ELIMINAR */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await SecuenciaNcf.findByPk(id);
    if (!registro) return res.status(404).json({ error: "Secuencia no encontrada" });
    await registro.destroy();
    res.json({ mensaje: "Secuencia eliminada correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR SECUENCIA:", error);
    res.status(500).json({ error: error.message });
  }
};