const { Dosis, Tratamiento, Insumo } = require("../MODEL");

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const dosis = await Dosis.findAll({
      include: [
        { model: Tratamiento, as: "tratamiento", attributes: ["nombre", "tipo_tratamiento"] },
        { model: Insumo,      as: "insumo",      attributes: ["nombre"] }
      ],
      order: [["id_dosis", "ASC"]]
    });
    res.json(dosis);
  } catch (error) {
    console.error("ERROR LISTAR DOSIS:", error);
    res.status(500).json({ error: error.message });
  }
};

/* OBTENER */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const dosis = await Dosis.findByPk(id, {
      include: [
        { model: Tratamiento, as: "tratamiento", attributes: ["nombre", "tipo_tratamiento"] },
        { model: Insumo,      as: "insumo",      attributes: ["nombre"] }
      ]
    });
    if (!dosis) return res.status(404).json({ error: "Dosis no encontrada" });
    res.json(dosis);
  } catch (error) {
    console.error("ERROR OBTENER DOSIS:", error);
    res.status(500).json({ error: error.message });
  }
};

/* LISTAR POR TRATAMIENTO */
exports.listarPorTratamiento = async (req, res) => {
  try {
    const { id_tratamiento } = req.params;
    const dosis = await Dosis.findAll({
      where: { id_tratamiento },
      include: [
        { model: Insumo, as: "insumo", attributes: ["nombre"] }
      ],
      order: [["hora_aplicacion", "ASC"]]
    });
    res.json(dosis);
  } catch (error) {
    console.error("ERROR LISTAR DOSIS POR TRATAMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* CREAR */
exports.crear = async (req, res) => {
  try {
    const { id_tratamiento, cantidad, unidad, hora_aplicacion, id_insumo } = req.body;

    if (!id_tratamiento)   return res.status(400).json({ error: "El tratamiento es obligatorio" });
    if (!cantidad)         return res.status(400).json({ error: "La cantidad es obligatoria" });
    if (!unidad?.trim())   return res.status(400).json({ error: "La unidad es obligatoria" });
    if (!id_insumo)        return res.status(400).json({ error: "El insumo es obligatorio" });

    const dosis = await Dosis.create({
      id_tratamiento,
      cantidad,
      unidad:          unidad.trim(),
      hora_aplicacion: hora_aplicacion?.trim() || null,
      id_insumo
    });

    res.status(201).json({ mensaje: "Dosis registrada correctamente", dosis });
  } catch (error) {
    console.error("ERROR CREAR DOSIS:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ACTUALIZAR */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_tratamiento, cantidad, unidad, hora_aplicacion, id_insumo } = req.body;

    const dosis = await Dosis.findByPk(id);
    if (!dosis) return res.status(404).json({ error: "Dosis no encontrada" });

    await dosis.update({
      id_tratamiento:  id_tratamiento              ?? dosis.id_tratamiento,
      cantidad:        cantidad                    ?? dosis.cantidad,
      unidad:          unidad?.trim()              ?? dosis.unidad,
      hora_aplicacion: hora_aplicacion?.trim()     ?? dosis.hora_aplicacion,
      id_insumo:       id_insumo                  ?? dosis.id_insumo
    });

    res.json({ mensaje: "Dosis actualizada correctamente", dosis });
  } catch (error) {
    console.error("ERROR ACTUALIZAR DOSIS:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ELIMINAR */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const dosis = await Dosis.findByPk(id);
    if (!dosis) return res.status(404).json({ error: "Dosis no encontrada" });
    await dosis.destroy();
    res.json({ mensaje: "Dosis eliminada correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR DOSIS:", error);
    res.status(500).json({ error: error.message });
  }
};