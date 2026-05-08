// MODULOS/PARTO/CONTROLLER/parto.controller.js
const { Parto, Embarazo } = require("../MODEL");
 
/* ── CREAR ─────────────────────────────────────────────── */
exports.crear = async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);
 
    const { id_embarazo, fecha_parto, numero_crias, observaciones } = req.body;
 
    if (!id_embarazo || !fecha_parto) {
      return res.status(400).json({
        error: "Faltan campos obligatorios: Id_embarazo, Fecha_parto"
      });
    }
 
    // Verificar que el embarazo existe
    const embarazo = await Embarazo.findByPk(id_embarazo);
    if (!embarazo) {
      return res.status(404).json({ error: "El embarazo indicado no existe" });
    }
 
    const toInt = (val) => (val && val !== "") ? parseInt(val) : null;

    const parto = await Parto.create({
      id_embarazo: toInt(id_embarazo),
      fecha_parto,
      numero_crias: toInt(numero_crias),
      observaciones: observaciones || null
    });
 
    res.status(201).json({ mensaje: "Parto registrado correctamente", parto });
  } catch (error) {
    console.error("ERROR CREAR PARTO:", error);
    res.status(500).json({ error: error.message });
  }
};
 
/* ── LISTAR ────────────────────────────────────────────── */
exports.listar = async (req, res) => {
  try {
    const partos = await Parto.findAll({
      order: [["fecha_parto", "DESC"]]
    });

    res.json(partos);
  } catch (error) {
    console.error("ERROR LISTAR PARTOS:", error);
    res.status(500).json({ error: error.message });
  }
};
 
/* ── OBTENER POR ID ────────────────────────────────────── */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
 
    const parto = await Parto.findByPk(id, {
      include: [
        {
          model: Embarazo,
          as: "EMBARAZO",
          attributes: ["id_embarazo", "fase", "fecha_prevista_parto", "id_veterinario", "id_inseminacion"]
        }
      ]
    });
 
    if (!parto) {
      return res.status(404).json({ error: "Parto no encontrado" });
    }
 
    res.json(parto);
  } catch (error) {
    console.error("ERROR OBTENER PARTO:", error);
    res.status(500).json({ error: error.message });
  }
};
 
/* ── ACTUALIZAR ────────────────────────────────────────── */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
 
    const parto = await Parto.findByPk(id);
    if (!parto) {
      return res.status(404).json({ error: "Parto no encontrado" });
    }
 
    // Si cambia el Id_embarazo, verificar que el nuevo existe
    if (req.body.id_embarazo) {
      const embarazo = await Embarazo.findByPk(req.body.id_embarazo);
      if (!embarazo) {
        return res.status(404).json({ error: "El embarazo indicado no existe" });
      }
    }
 
    await parto.update(req.body);
 
    res.json({ mensaje: "Parto actualizado correctamente", parto });
  } catch (error) {
    console.error("ERROR ACTUALIZAR PARTO:", error);
    res.status(500).json({ error: error.message });
  }
};
 
/* ── ELIMINAR ──────────────────────────────────────────── */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
 
    const parto = await Parto.findByPk(id);
    if (!parto) {
      return res.status(404).json({ error: "Parto no encontrado" });
    }
 
    await parto.destroy();
 
    res.json({ mensaje: "Parto eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR PARTO:", error);
    res.status(500).json({ error: error.message });
  }
};
 
console.log("🚀 parto.controller cargado");