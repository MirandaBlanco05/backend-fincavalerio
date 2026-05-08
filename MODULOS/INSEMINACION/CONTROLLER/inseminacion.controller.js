const Inseminacion = require("../MODEL/inseminacion.model");      
const Ciclo = require("../../REPRODUCCION/MODEL/celo.model");       
const Veterinario = require("../../VISITA/MODEL/veterinario.model");
const Bovino = require("../../BOVINO/MODEL/bovino.model");


// 🔹 Crear
exports.crearInseminacion = async (req, res) => {
  try {
    const { id_veterinario, id_ciclo } = req.body;
    const nueva = await Inseminacion.create({
      ...req.body,
      id_veterinario: id_veterinario ? parseInt(id_veterinario) : null,
      id_ciclo: id_ciclo ? parseInt(id_ciclo) : null
    });
    res.status(201).json(nueva);
  } catch (error) {
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
      ]
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
        { 
          model: Ciclo,
          as: "ciclo"
        },
        { 
          model: Veterinario,
          as: "veterinario"
        }
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

    const camposPermitidos = {
      id_veterinario: req.body.id_veterinario,
      id_ciclo: req.body.id_ciclo,
      tipo_inseminacion: req.body.tipo_inseminacion,
      resultado: req.body.resultado,
      fecha: req.body.fecha
    };

    const [actualizado] = await Inseminacion.update(camposPermitidos, {
      where: { id_inseminacion: id }
    });

    if (!actualizado) {
      return res.status(404).json({ mensaje: "Inseminación no encontrada" });
    }

    const inseminacionActualizada = await Inseminacion.findByPk(id, {
      include: [
        { model: Ciclo, as: "ciclo" },
        { model: Veterinario, as: "veterinario" }
      ]
    });

    res.json(inseminacionActualizada);

  } catch (error) {
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