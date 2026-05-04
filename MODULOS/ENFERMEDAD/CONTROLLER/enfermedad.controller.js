const Enfermedad = require("../MODEL");

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const enfermedades = await Enfermedad.findAll({ order: [["nombre", "ASC"]] });
    res.json(enfermedades);
  } catch (error) {
    console.error("ERROR LISTAR ENFERMEDAD:", error);
    res.status(500).json({ error: error.message });
  }
};

/* OBTENER */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const enfermedad = await Enfermedad.findByPk(id);
    if (!enfermedad) return res.status(404).json({ error: "Enfermedad no encontrada" });
    res.json(enfermedad);
  } catch (error) {
    console.error("ERROR OBTENER ENFERMEDAD:", error);
    res.status(500).json({ error: error.message });
  }
};

/* CREAR */
exports.crear = async (req, res) => {
  try {
    const { nombre, causa } = req.body;
    if (!nombre?.trim()) return res.status(400).json({ error: "El nombre es obligatorio" });

    const enfermedad = await Enfermedad.create({
      nombre: nombre.trim(),
      causa:  causa?.trim() || null
    });
    res.status(201).json({ mensaje: "Enfermedad registrada correctamente", enfermedad });
  } catch (error) {
    console.error("ERROR CREAR ENFERMEDAD:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ACTUALIZAR */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, causa } = req.body;

    const enfermedad = await Enfermedad.findByPk(id);
    if (!enfermedad) return res.status(404).json({ error: "Enfermedad no encontrada" });

    await enfermedad.update({
      nombre: nombre?.trim() ?? enfermedad.nombre,
      causa:  causa?.trim()  ?? enfermedad.causa
    });
    res.json({ mensaje: "Enfermedad actualizada correctamente", enfermedad });
  } catch (error) {
    console.error("ERROR ACTUALIZAR ENFERMEDAD:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ELIMINAR */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const enfermedad = await Enfermedad.findByPk(id);
    if (!enfermedad) return res.status(404).json({ error: "Enfermedad no encontrada" });
    await enfermedad.destroy();
    res.json({ mensaje: "Enfermedad eliminada correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR ENFERMEDAD:", error);
    res.status(500).json({ error: error.message });
  }
};