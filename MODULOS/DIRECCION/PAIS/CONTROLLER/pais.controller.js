// MODULOS/DIRECCION/PAIS/CONTROLLER/pais.controller.js
const Pais = require("../MODEL/pais.model");

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const paises = await Pais.findAll({ order: [["nombre", "ASC"]] });
    res.json(paises);
  } catch (error) {
    console.error("ERROR LISTAR PAIS:", error);
    res.status(500).json({ error: error.message });
  }
};

/* OBTENER POR ID */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const pais = await Pais.findByPk(id);
    if (!pais) return res.status(404).json({ error: "País no encontrado" });
    res.json(pais);
  } catch (error) {
    console.error("ERROR OBTENER PAIS:", error);
    res.status(500).json({ error: error.message });
  }
};


