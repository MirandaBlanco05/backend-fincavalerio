const { Embarazo, Veterinario, Inseminacion } = require("../MODEL");
const Ciclo = require("../../REPRODUCCION/MODEL/celo.model");
const Bovino = require("../../BOVINO/MODEL/bovino.model");
 
/* ── CREAR ── */
exports.crear = async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);
 
    const { id_inseminacion, id_veterinario, fase, fecha_secado, fecha_prevista_parto } = req.body;
 
    if (!id_inseminacion || !id_veterinario || !fecha_prevista_parto) {
      return res.status(400).json({
        error: "Faltan campos obligatorios: Id_inseminacion, Id_veterinario, Fecha_prevista_parto"
      });
    }
 
    const toInt = (val) => (val && val !== "") ? parseInt(val) : null;

    const embarazo = await Embarazo.create({
      id_inseminacion: toInt(id_inseminacion),
      id_veterinario: toInt(id_veterinario),
      fase: fase || null,
      fecha_secado: fecha_secado || null,
      fecha_prevista_parto
    });
 
    res.status(201).json({ mensaje: "Embarazo registrado correctamente", embarazo });
  } catch (error) {
    console.error("ERROR CREAR EMBARAZO:", error);
    res.status(500).json({ error: error.message });
  }
};
 
/* ── LISTAR ── */
exports.listar = async (req, res) => {
  try {
    const embarazos = await Embarazo.findAll({
      include: [
        {
          model: Veterinario,
          as: "VETERINARIO",
          attributes: ["nombre"]
        },
        {
          model: Inseminacion,
          as: "INSEMINACION",
          attributes: ["id_inseminacion", "fecha"],
          include: [
            {
              model: Ciclo,
              as: "ciclo",
              include: [{ model: Bovino, as: "bovino" }]
            }
          ]
        }
      ]
    });
 
    res.json(embarazos);
  } catch (error) {
    console.error("ERROR LISTAR EMBARAZOS:", error);
    res.status(500).json({ error: error.message });
  }
};
 
/* ── OBTENER POR ID ── */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
 
    const embarazo = await Embarazo.findByPk(id, {
      include: [
        { model: Veterinario, as: "VETERINARIO" },
        { 
          model: Inseminacion, 
          as: "INSEMINACION",
          include: [
            {
              model: Ciclo,
              as: "ciclo",
              include: [{ model: Bovino, as: "bovino" }]
            }
          ]
        }
      ]
    });
 
    if (!embarazo) {
      return res.status(404).json({ error: "Embarazo no encontrado" });
    }
 
    res.json(embarazo);
  } catch (error) {
    console.error("ERROR OBTENER EMBARAZO:", error);
    res.status(500).json({ error: error.message });
  }
};
 
/* ── ACTUALIZAR ── */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;
 
    const embarazo = await Embarazo.findByPk(id);
 
    if (!embarazo) {
      return res.status(404).json({ error: "Embarazo no encontrado" });
    }
 
    await embarazo.update(datos);
 
    res.json({ mensaje: "Embarazo actualizado correctamente", embarazo });
  } catch (error) {
    console.error("ERROR ACTUALIZAR EMBARAZO:", error);
    res.status(500).json({ error: error.message });
  }
};
 
/* ── ELIMINAR ── */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
 
    const embarazo = await Embarazo.findByPk(id);
 
    if (!embarazo) {
      return res.status(404).json({ error: "Embarazo no encontrado" });
    }
 
    await embarazo.destroy();
 
    res.json({ mensaje: "Embarazo eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR EMBARAZO:", error);
    res.status(500).json({ error: error.message });
  }
};
 
console.log("🚀 embarazo.controller cargado");