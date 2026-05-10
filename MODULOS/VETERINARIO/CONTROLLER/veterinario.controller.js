const { Veterinario } = require("../MODEL");

// Listar todos los veterinarios
exports.listar = async (req, res) => {
  try {
    const veterinarios = await Veterinario.findAll({
      order: [["nombre", "ASC"]]
    });
    res.json(veterinarios);
  } catch (error) {
    console.error("Error al listar veterinarios:", error);
    res.status(500).json({ error: "Error al listar veterinarios" });
  }
};

// Obtener veterinario por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const veterinario = await Veterinario.findByPk(id);
    
    if (!veterinario) {
      return res.status(404).json({ error: "Veterinario no encontrado" });
    }
    
    res.json(veterinario);
  } catch (error) {
    console.error("Error al obtener veterinario:", error);
    res.status(500).json({ error: "Error al obtener veterinario" });
  }
};

// Crear veterinario
exports.crear = async (req, res) => {
  try {
    const { nombre, cedula, telefono } = req.body;
    
    const nuevoVeterinario = await Veterinario.create({
      nombre,
      cedula,
      telefono
    });
    
    res.status(201).json(nuevoVeterinario);
  } catch (error) {
    console.error("Error al crear veterinario:", error);
    res.status(500).json({ error: "Error al crear veterinario" });
  }
};

// Actualizar veterinario
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cedula, telefono } = req.body;
    
    const veterinario = await Veterinario.findByPk(id);
    
    if (!veterinario) {
      return res.status(404).json({ error: "Veterinario no encontrado" });
    }
    
    await veterinario.update({
      nombre,
      cedula,
      telefono
    });
    
    res.json(veterinario);
  } catch (error) {
    console.error("Error al actualizar veterinario:", error);
    res.status(500).json({ error: "Error al actualizar veterinario" });
  }
};

// Eliminar veterinario
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const veterinario = await Veterinario.findByPk(id);
    
    if (!veterinario) {
      return res.status(404).json({ error: "Veterinario no encontrado" });
    }
    
    await veterinario.destroy();
    res.json({ mensaje: "Veterinario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar veterinario:", error);
    res.status(500).json({ error: "Error al eliminar veterinario" });
  }
};