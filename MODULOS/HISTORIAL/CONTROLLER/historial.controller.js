const { Historial, Enfermedad, Bovino, HistorialEnfermedad } = require("../MODEL");

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const historiales = await Historial.findAll({
      include: [
        { model: Bovino,      as: "bovino",       attributes: ["nombre", "numero_crotal"] },
        { model: Enfermedad,  as: "enfermedades", attributes: ["nombre"],
          through: { attributes: [] } }
      ],
      order: [["id_historial", "DESC"]]
    });
    res.json(historiales);
  } catch (error) {
    console.error("ERROR LISTAR HISTORIAL:", error);
    res.status(500).json({ error: error.message });
  }
};

/* LISTAR POR BOVINO */
exports.listarPorBovino = async (req, res) => {
  try {
    const { id_bovino } = req.params;
    const historiales = await Historial.findAll({
      where: { id_bovino },
      include: [
        { model: Bovino,      as: "bovino",       attributes: ["nombre", "numero_crotal"] },
        { model: Enfermedad,  as: "enfermedades", attributes: ["nombre"],
          through: { attributes: [] } }
      ],
      order: [["id_historial", "DESC"]]
    });
    res.json(historiales);
  } catch (error) {
    console.error("ERROR LISTAR HISTORIAL POR BOVINO:", error);
    res.status(500).json({ error: error.message });
  }
};
/* OBTENER POR ID */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const historial = await Historial.findByPk(id, {
      include: [
        { model: Bovino,     as: "bovino",       attributes: ["nombre", "numero_crotal"] },
        { model: Enfermedad, as: "enfermedades", attributes: ["nombre"],
          through: { attributes: [] } }
      ]
    });
    if (!historial) return res.status(404).json({ error: "Historial no encontrado" });
    res.json(historial);
  } catch (error) {
    console.error("ERROR OBTENER HISTORIAL:", error);
    res.status(500).json({ error: error.message });
  }
};

/* CREAR */
exports.crear = async (req, res) => {
  try {
    let { id_bovino, enfermedades, id_enfermedad, fecha } = req.body;

    if (!id_bovino) return res.status(400).json({ error: "El bovino es obligatorio" });
    
    // Soporte para un solo ID o array
    if (id_enfermedad && !enfermedades) {
      enfermedades = [id_enfermedad];
    }

    if (!enfermedades?.length) return res.status(400).json({ error: "Debe seleccionar al menos una enfermedad" });

    const historial = await Historial.create({ 
      id_bovino,
      fecha: fecha || null
    });

    const registros = enfermedades.map(enfId => ({
      id_historial:  historial.id_historial,
      id_enfermedad: parseInt(enfId)
    }));
    await HistorialEnfermedad.bulkCreate(registros);

    res.status(201).json({ mensaje: "Historial registrado correctamente", historial });
  } catch (error) {
    console.error("ERROR CREAR HISTORIAL:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ACTUALIZAR */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    let { id_bovino, enfermedades, id_enfermedad, fecha } = req.body;

    const historial = await Historial.findByPk(id);
    if (!historial) return res.status(404).json({ error: "Historial no encontrado" });

    const updateData = {};
    if (id_bovino) updateData.id_bovino = id_bovino;
    if (fecha !== undefined) updateData.fecha = fecha;
    
    await historial.update(updateData);

    // Soporte para un solo ID o array
    if (id_enfermedad && !enfermedades) {
      enfermedades = [id_enfermedad];
    }

    if (enfermedades?.length) {
      await HistorialEnfermedad.destroy({ where: { id_historial: id } });
      const registros = enfermedades.map(enfId => ({
        id_historial:  parseInt(id),
        id_enfermedad: parseInt(enfId)
      }));
      await HistorialEnfermedad.bulkCreate(registros);
    }

    res.json({ mensaje: "Historial actualizado correctamente" });
  } catch (error) {
    console.error("ERROR ACTUALIZAR HISTORIAL:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ELIMINAR */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const historial = await Historial.findByPk(id);
    if (!historial) return res.status(404).json({ error: "Historial no encontrado" });

    await HistorialEnfermedad.destroy({ where: { id_historial: id } });
    await historial.destroy();

    res.json({ mensaje: "Historial eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR HISTORIAL:", error);
    res.status(500).json({ error: error.message });
  }
};