const { GrupoBovino } = require("../MODEL");

exports.listar = async (req, res) => {
  try {
    const grupos = await GrupoBovino.findAll();
    res.json(grupos);
  } catch (error) {
    console.error("ERROR LISTAR GRUPOS:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const nuevo = await GrupoBovino.create({ nombre, descripcion });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GrupoBovino.findByPk(id);
    if (!item) return res.status(404).json({ error: "Grupo no encontrado" });
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GrupoBovino.findByPk(id);
    if (!item) return res.status(404).json({ error: "Grupo no encontrado" });
    await item.destroy();
    res.json({ mensaje: "Grupo eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
