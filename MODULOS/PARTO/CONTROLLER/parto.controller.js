// MODULOS/PARTO/CONTROLLER/parto.controller.js
const { Parto, Embarazo } = require("../MODEL");
 
/* ── CREAR ─────────────────────────────────────────────── */
exports.crear = async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);
 
    const { Id_embarazo, Fecha_parto, Numero_crias, observaciones } = req.body;
 
    if (!Id_embarazo || !Fecha_parto) {
      return res.status(400).json({
        error: "Faltan campos obligatorios: Id_embarazo, Fecha_parto"
      });
    }
 
    // Verificar que el embarazo existe
    const embarazo = await Embarazo.findByPk(Id_embarazo);
    if (!embarazo) {
      return res.status(404).json({ error: "El embarazo indicado no existe" });
    }
 
    const parto = await Parto.create({
      Id_embarazo,
      Fecha_parto,
      Numero_crias: Numero_crias ?? null,
      observaciones: observaciones ?? null
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
      order: [["Fecha_parto", "DESC"]]
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
          attributes: ["Id_embarazo", "fase", "Fecha_prevista_parto", "Id_veterinario", "Id_inseminacion"]
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
    if (req.body.Id_embarazo) {
      const embarazo = await Embarazo.findByPk(req.body.Id_embarazo);
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