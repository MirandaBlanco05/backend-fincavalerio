const { Veterinario } = require("../MODEL");

// 📋 LISTAR VETERINARIOS
exports.listar = async (req, res) => {
  try {
    const veterinarios = await Veterinario.findAll();
    res.json(veterinarios);
  } catch (error) {
    console.error("ERROR LISTAR VETERINARIOS:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🔍 OBTENER POR ID
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const veterinario = await Veterinario.findByPk(id);
    if (!veterinario) return res.status(404).json({ error: "Veterinario no encontrado" });
    res.json(veterinario);
  } catch (error) {
    console.error("ERROR BUSCAR VETERINARIO:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ➕ CREAR VETERINARIO
exports.crear = async (req, res) => {
  try {
    const nuevo = await Veterinario.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("ERROR CREAR VETERINARIO:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ✏️ ACTUALIZAR VETERINARIO
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const veterinario = await Veterinario.findByPk(id);
    if (!veterinario) return res.status(404).json({ error: "Veterinario no encontrado" });
    
    await veterinario.update(req.body);
    res.json(veterinario);
  } catch (error) {
    console.error("ERROR ACTUALIZAR VETERINARIO:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🗑️ ELIMINAR VETERINARIO
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const veterinario = await Veterinario.findByPk(id);
    if (!veterinario) return res.status(404).json({ error: "Veterinario no encontrado" });
    
    await veterinario.destroy();
    res.json({ mensaje: "Veterinario eliminado" });
  } catch (error) {
    console.error("ERROR ELIMINAR VETERINARIO:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
