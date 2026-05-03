const { ComprobanteFiscal, SecuenciaNcf } = require("../MODEL");

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const comprobantes = await ComprobanteFiscal.findAll({
      include: [{ model: SecuenciaNcf, as: "secuencias" }],
      order: [["nombre", "ASC"]]
    });
    res.json(comprobantes);
  } catch (error) {
    console.error("ERROR LISTAR COMPROBANTE:", error);
    res.status(500).json({ error: error.message });
  }
};

/* OBTENER POR ID */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const comprobante = await ComprobanteFiscal.findByPk(id, {
      include: [{ model: SecuenciaNcf, as: "secuencias" }]
    });
    if (!comprobante) return res.status(404).json({ error: "Comprobante no encontrado" });
    res.json(comprobante);
  } catch (error) {
    console.error("ERROR OBTENER COMPROBANTE:", error);
    res.status(500).json({ error: error.message });
  }
};

/* CREAR */
exports.crear = async (req, res) => {
  try {
    const { nombre, tipo, serie } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }
    if (tipo === undefined || tipo === null) {
      return res.status(400).json({ error: "El tipo es obligatorio" });
    }
    if (!serie || serie.trim() === "") {
      return res.status(400).json({ error: "La serie es obligatoria" });
    }

    const comprobante = await ComprobanteFiscal.create({
      nombre: nombre.trim(),
      tipo,
      serie: serie.trim()
    });

    res.status(201).json({ mensaje: "Comprobante registrado correctamente", comprobante });
  } catch (error) {
    console.error("ERROR CREAR COMPROBANTE:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ACTUALIZAR */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, serie } = req.body;

    const comprobante = await ComprobanteFiscal.findByPk(id);
    if (!comprobante) return res.status(404).json({ error: "Comprobante no encontrado" });

    await comprobante.update({
      nombre: nombre?.trim() ?? comprobante.nombre,
      tipo:   tipo           ?? comprobante.tipo,
      serie:  serie?.trim()  ?? comprobante.serie
    });

    res.json({ mensaje: "Comprobante actualizado correctamente", comprobante });
  } catch (error) {
    console.error("ERROR ACTUALIZAR COMPROBANTE:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ELIMINAR */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const comprobante = await ComprobanteFiscal.findByPk(id);
    if (!comprobante) return res.status(404).json({ error: "Comprobante no encontrado" });
    await comprobante.destroy();
    res.json({ mensaje: "Comprobante eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR COMPROBANTE:", error);
    res.status(500).json({ error: error.message });
  }
};