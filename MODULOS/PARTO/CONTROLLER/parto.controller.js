// MODULOS/PARTO/CONTROLLER/parto.controller.js
const { Parto, Embarazo, Bovino, Inseminacion, Ciclo } = require("../MODEL");
 
/* ── CREAR ─────────────────────────────────────────────── */
exports.crear = async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);
 
    const { 
      id_embarazo, fecha_parto, numero_crias, observaciones,
      tipo_parto, sexo_cria, peso_cria, estado_cria 
    } = req.body;
 
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
      tipo_parto,
      sexo_cria,
      peso_cria: peso_cria || null,
      estado_cria,
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
      include: [
        {
          model: Embarazo,
          as: "EMBARAZO",
          include: [
            {
              model: Inseminacion,
              as: "INSEMINACION",
              include: [
                {
                  model: Ciclo,
                  as: "ciclo",
                  include: [
                    { model: Bovino, as: "bovino", attributes: ["id_bovino", "nombre", "numero_crotal"] }
                  ]
                }
              ]
            }
          ]
        }
      ],
      order: [["fecha_parto", "DESC"]]
    });

    const resultado = partos.map(p => {
      const bovino = p.EMBARAZO?.INSEMINACION?.ciclo?.bovino || null;
      return {
        id_parto:     p.id_parto,
        id_embarazo:  p.id_embarazo,
        fecha_parto:  p.fecha_parto,
        numero_crias: p.numero_crias,
        tipo_parto:   p.tipo_parto,
        sexo_cria:    p.sexo_cria,
        peso_cria:    p.peso_cria,
        estado_cria:  p.estado_cria,
        observaciones: p.observaciones,
        bovino:       bovino,
        id_bovino:    bovino?.id_bovino || null
      };
    });

    res.json(resultado);
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
 
    const cleanData = { ...req.body };
    const toInt = (val) => (val && val !== "" && val !== null) ? parseInt(val) : null;
    const toFloat = (val) => (val && val !== "" && val !== null) ? parseFloat(val) : null;

    if (cleanData.id_embarazo !== undefined) cleanData.id_embarazo = toInt(cleanData.id_embarazo);
    if (cleanData.numero_crias !== undefined) cleanData.numero_crias = toInt(cleanData.numero_crias);
    if (cleanData.peso_cria !== undefined) cleanData.peso_cria = toFloat(cleanData.peso_cria);

    await parto.update(cleanData);
 
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