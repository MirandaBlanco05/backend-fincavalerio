const Ciclo = require("../MODEL/celo.model");
const Bovino = require("../../BOVINO/MODEL/bovino.model");


// 🔹 Crear
exports.crearCiclo = async (req, res) => {
  try {
    const nuevo = await Ciclo.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 Obtener todos (CON BOVINO)
exports.obtenerCiclos = async (req, res) => {
  try {
    const lista = await Ciclo.findAll({
      attributes: { exclude: ["Id_bovino"] }, 
      include: [
        {
          model: Bovino,
          attributes: ["id_bovino", "nombre"] 
        }
      ]
    });

    res.json(lista);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 🔹 Obtener por ID
exports.obtenerCicloPorId = async (req, res) => {
  try {
    const ciclo = await Ciclo.findByPk(req.params.id, {
      include: [
        { model: Bovino }
      ]
    });

    if (!ciclo) {
      return res.status(404).json({ mensaje: "Ciclo no encontrado" });
    }

    res.json(ciclo);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 Actualizar (VERSIÓN SEGURA)
exports.actualizarCiclo = async (req, res) => {
  try {
    const { id } = req.params;

    const camposPermitidos = {
      Id_bovino: req.body.Id_bovino,
      Fecha_inicio: req.body.Fecha_inicio,
      Fecha_fin: req.body.Fecha_fin,
      duracion: req.body.duracion,
      observaciones: req.body.observaciones
    };

    const [actualizado] = await Ciclo.update(camposPermitidos, {
      where: { Id_ciclo: id }
    });

    if (!actualizado) {
      return res.status(404).json({ mensaje: "Ciclo no encontrado" });
    }

    const cicloActualizado = await Ciclo.findByPk(id, {
      include: [
        { model: Bovino }
      ]
    });

    res.json(cicloActualizado);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 Eliminar
exports.eliminarCiclo = async (req, res) => {
  try {
    const eliminado = await Ciclo.destroy({
      where: { Id_ciclo: req.params.id }
    });

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Ciclo no encontrado" });
    }

    res.json({ mensaje: "Ciclo eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
