const { Tratamiento, Enfermedad, Empleado, Bovino } = require("../MODEL");

/* ══ LISTAR ══ */
exports.listar = async (req, res) => {
  try {
    const tratamientos = await Tratamiento.findAll({
      include: [
        { model: Empleado,   as: "empleado",   attributes: ["nombre"] },
        { model: Enfermedad, as: "enfermedad", attributes: ["nombre"] },
        { model: Bovino,     as: "bovino",     attributes: ["nombre", "numero_crotal"] }
      ],
      order: [["fecha_inicio", "DESC"]]
    });

    const resultado = tratamientos.map(t => ({
      id_tratamiento:   t.id_tratamiento,
      id_bovino:        t.id_bovino,
      id_enfermedad:    t.id_enfermedad,
      id_empleado:      t.id_empleado,
      nombre:           t.nombre,
      tipo_tratamiento: t.tipo_tratamiento,
      fecha_inicio:     t.fecha_inicio,
      fecha_fin:        t.fecha_fin,
      empleado:         t.empleado?.nombre || null,
      enfermedad:       t.enfermedad?.nombre || null,
      animal:           t.bovino?.nombre || null,
      crotal:           t.bovino?.numero_crotal || null
    }));

    res.json(resultado);
  } catch (error) {
    console.error("ERROR LISTAR TRATAMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ LISTAR POR ENFERMEDAD ══ */
exports.listarPorEnfermedad = async (req, res) => {
  try {
    const { id_enfermedad } = req.params;
    const tratamientos = await Tratamiento.findAll({
      where: { id_enfermedad },
      include: [
        { model: Empleado,   as: "empleado",   attributes: ["nombre"] },
        { model: Enfermedad, as: "enfermedad", attributes: ["nombre"] },
        { model: Bovino,     as: "bovino",     attributes: ["nombre", "numero_crotal"] }
      ],
      order: [["fecha_inicio", "DESC"]]
    });
    res.json(tratamientos);
  } catch (error) {
    console.error("ERROR LISTAR TRATAMIENTO POR ENFERMEDAD:", error);
    res.status(500).json({ error: error.message });
  }
};
/* ══ OBTENER POR ID ══ */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const t = await Tratamiento.findByPk(id, {
      include: [
        { model: Empleado,   as: "empleado",   attributes: ["nombre"] },
        { model: Enfermedad, as: "enfermedad", attributes: ["nombre"] },
        { model: Bovino,     as: "bovino",     attributes: ["nombre", "numero_crotal"] }
      ]
    });

    if (!t) return res.status(404).json({ error: "Tratamiento no encontrado" });

    res.json({
      id_tratamiento:   t.id_tratamiento,
      id_bovino:        t.id_bovino,
      id_enfermedad:    t.id_enfermedad,
      id_empleado:      t.id_empleado,
      nombre:           t.nombre,
      tipo_tratamiento: t.tipo_tratamiento,
      fecha_inicio:     t.fecha_inicio,
      fecha_fin:        t.fecha_fin,
      empleado:         t.empleado?.nombre || null,
      enfermedad:       t.enfermedad?.nombre || null,
      animal:           t.bovino?.nombre || null,
      crotal:           t.bovino?.numero_crotal || null
    });
  } catch (error) {
    console.error("ERROR OBTENER TRATAMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ CREAR ══ */
exports.crear = async (req, res) => {
  try {
    const { id_bovino, id_enfermedad, id_empleado, nombre, tipo_tratamiento, fecha_inicio, fecha_fin } = req.body;

    if (!id_enfermedad)  return res.status(400).json({ error: "La enfermedad es obligatoria" });
    if (!id_empleado)    return res.status(400).json({ error: "El empleado es obligatorio" });
    if (!nombre?.trim()) return res.status(400).json({ error: "El nombre es obligatorio" });

    const tratamiento = await Tratamiento.create({
      id_bovino,
      id_enfermedad,
      id_empleado,
      nombre:           nombre.trim(),
      tipo_tratamiento: tipo_tratamiento?.trim() || null,
      fecha_inicio:     fecha_inicio             || null,
      fecha_fin:        fecha_fin                || null
    });

    res.status(201).json({ mensaje: "Tratamiento registrado correctamente", tratamiento });
  } catch (error) {
    console.error("ERROR CREAR TRATAMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ ACTUALIZAR ══ */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_bovino, id_enfermedad, id_empleado, nombre, tipo_tratamiento, fecha_inicio, fecha_fin } = req.body;

    const tratamiento = await Tratamiento.findByPk(id);
    if (!tratamiento) return res.status(404).json({ error: "Tratamiento no encontrado" });

    await tratamiento.update({
      id_bovino:        id_bovino                ?? tratamiento.id_bovino,
      id_enfermedad:    id_enfermedad            ?? tratamiento.id_enfermedad,
      id_empleado:      id_empleado              ?? tratamiento.id_empleado,
      nombre:           nombre?.trim()           ?? tratamiento.nombre,
      tipo_tratamiento: tipo_tratamiento?.trim() ?? tratamiento.tipo_tratamiento,
      fecha_inicio:     fecha_inicio             ?? tratamiento.fecha_inicio,
      fecha_fin:        fecha_fin                ?? tratamiento.fecha_fin
    });

    res.json({ mensaje: "Tratamiento actualizado correctamente", tratamiento });
  } catch (error) {
    console.error("ERROR ACTUALIZAR TRATAMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ══ ELIMINAR ══ */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const tratamiento = await Tratamiento.findByPk(id);
    if (!tratamiento) return res.status(404).json({ error: "Tratamiento no encontrado" });
    await tratamiento.destroy();
    res.json({ mensaje: "Tratamiento eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR TRATAMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};