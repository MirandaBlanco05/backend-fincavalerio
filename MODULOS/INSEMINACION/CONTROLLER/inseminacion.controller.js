const Inseminacion = require("../../REPRODUCCION/MODEL/inseminacion.model");
const Ciclo = require("../../REPRODUCCION/MODEL/celo.model");
const Veterinario = require("../../VISITA/MODEL/veterinario.model");


// 🔹 Crear
exports.crearInseminacion = async (req, res) => {
  try {
    const nueva = await Inseminacion.create(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 Obtener todas (CON RELACIONES)
exports.obtenerInseminaciones = async (req, res) => {
  try {
    const lista = await Inseminacion.findAll({
      include: [
        { 
          model: Ciclo,
          as: "ciclo"   // 👈 OBLIGATORIO
        },
        { 
          model: Veterinario,
          as: "veterinario"   // 👈 OBLIGATORIO
        }
      ]
    });

    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 Obtener por ID
exports.obtenerPorId = async (req, res) => {
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
      Id_veterinaro: req.body.Id_veterinaro,
      Id_ciclo: req.body.Id_ciclo,
      Tipo_inseminacion: req.body.Tipo_inseminacion,
      resultado: req.body.resultado,
      fecha: req.body.fecha
    };

    const [actualizado] = await Inseminacion.update(camposPermitidos, {
      where: { Id_inseminacion: id }
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
      where: { Id_inseminacion: req.params.id }
    });

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Inseminación no encontrada" });
    }

    res.json({ mensaje: "Inseminación eliminada correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};