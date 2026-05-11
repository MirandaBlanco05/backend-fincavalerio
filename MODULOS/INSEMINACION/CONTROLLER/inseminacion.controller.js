const Inseminacion = require("../MODEL/inseminacion.model");      
const Ciclo = require("../../REPRODUCCION/MODEL/celo.model");       
const Veterinario = require("../../VISITA/MODEL/veterinario.model");
const Bovino = require("../../BOVINO/MODEL/bovino.model");

const toInt = (val) => (val !== undefined && val !== null && val !== "") ? parseInt(val) : null;

// 🔹 Crear
exports.crearInseminacion = async (req, res) => {
  try {
    const { id_veterinario, id_ciclo, tipo_inseminacion, resultado, fecha } = req.body;

    const nueva = await Inseminacion.create({
      id_veterinario: toInt(id_veterinario),
      id_ciclo: toInt(id_ciclo),
      tipo_inseminacion: tipo_inseminacion?.trim() || null,
      resultado: resultado?.trim() || null,
      fecha: fecha || null
    });
    res.status(201).json(nueva);
  } catch (error) {
    console.error("ERROR CREAR INSEMINACION:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerInseminaciones = async (req, res) => {
  try {
    const lista = await Inseminacion.findAll({
      attributes: { exclude: ["id_ciclo", "id_veterinario"] },
      include: [
        {
          model: Ciclo,
          as: "ciclo",
          attributes: ["id_ciclo", "fecha_inicio"],
          include: [
            {
              model: Bovino,
              as: "bovino",
              attributes: [ "nombre", "numero_crotal"]
            }
          ]
        },
        {
          model: Veterinario,
          as: "veterinario",
          attributes: [ "nombre"]
        }
      ],
      order: [["fecha", "DESC"]]
    });

    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Obtener por ID
exports.obtenerInseminacionPorId = async (req, res) => {
  try {
    const inseminacion = await Inseminacion.findByPk(req.params.id, {
      include: [
        { model: Ciclo, as: "ciclo" },
        { model: Veterinario, as: "veterinario" }
      ]
    });

    if (!inseminacion) {
      return res.status(404).json({ mensaje: "Inseminación no encontrada" });
    }

    res.json(inseminacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Actualizar
exports.actualizarInseminacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_veterinario, id_ciclo, tipo_inseminacion, resultado, fecha } = req.body;

    const inseminacion = await Inseminacion.findByPk(id);
    if (!inseminacion) {
      return res.status(404).json({ mensaje: "Inseminación no encontrada" });
    }

    await inseminacion.update({
      id_veterinario:    id_veterinario !== undefined ? toInt(id_veterinario) : inseminacion.id_veterinario,
      id_ciclo:          id_ciclo !== undefined ? toInt(id_ciclo) : inseminacion.id_ciclo,
      tipo_inseminacion: tipo_inseminacion !== undefined ? (tipo_inseminacion?.trim() || null) : inseminacion.tipo_inseminacion,
      resultado:         resultado !== undefined ? (resultado?.trim() || null) : inseminacion.resultado,
      fecha:             fecha !== undefined ? (fecha || null) : inseminacion.fecha
    });

    const inseminacionActualizada = await Inseminacion.findByPk(id, {
      include: [
        { model: Ciclo, as: "ciclo" },
        { model: Veterinario, as: "veterinario" }
      ]
    });

    res.json(inseminacionActualizada);
  } catch (error) {
    console.error("ERROR ACTUALIZAR INSEMINACION:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Eliminar
exports.eliminarInseminacion = async (req, res) => {
  try {
    const eliminado = await Inseminacion.destroy({
      where: { id_inseminacion: req.params.id }
    });

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Inseminación no encontrada" });
    }

    res.json({ mensaje: "Inseminación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};