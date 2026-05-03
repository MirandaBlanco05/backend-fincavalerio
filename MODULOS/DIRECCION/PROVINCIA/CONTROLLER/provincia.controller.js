// MODULOS/DIRECCION/PROVINCIA/CONTROLLER/provincia.controller.js
const Provincia = require("../MODEL");
const Pais = require("../../PAIS/MODEL/pais.model");

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const provincias = await Provincia.findAll({
      include: [{ model: Pais, as: "pais", attributes: ["nombre"] }],
      order: [["nombre", "ASC"]]
    });
    res.json(provincias);
  } catch (error) {
    console.error("ERROR LISTAR PROVINCIA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* OBTENER POR ID */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const provincia = await Provincia.findByPk(id, {
      include: [{ model: Pais, as: "pais", attributes: ["nombre"] }]
    });
    if (!provincia) return res.status(404).json({ error: "Provincia no encontrada" });
    res.json(provincia);
  } catch (error) {
    console.error("ERROR OBTENER PROVINCIA:", error);
    res.status(500).json({ error: error.message });
  }
};

/* CREAR */
exports.crear = async (req, res) => {
  try {
    const { nombre, id_pais } = req.body;
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: "El nombre de la provincia es obligatorio" });
    }
    if (!id_pais) {
      return res.status(400).json({ error: "El país es obligatorio" });
    }
    const provincia = await Provincia.create({ nombre: nombre.trim(), id_pais });
    res.status(201).json({ mensaje: "Provincia registrada correctamente", provincia });
  } catch (error) {
    console.error("ERROR CREAR PROVINCIA:", error);
    res.status(500).json({ error: error.message });
  }
};



