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

//listar
exports.obtenerCiclos = async (req, res) => {
  try {
    const lista = await Ciclo.findAll({
      attributes: { exclude: ["id_bovino"] },
      include: [
        {
          model: Bovino,
          as: "bovino", 
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

    const camposPermitidos = {};

    if (req.body.id_bovino !== undefined) camposPermitidos.id_bovino = req.body.id_bovino;
    if (req.body.fecha_inicio !== undefined) camposPermitidos.fecha_inicio = req.body.fecha_inicio;
    if (req.body.fecha_fin !== undefined) camposPermitidos.fecha_fin = req.body.fecha_fin;
    if (req.body.duracion !== undefined) camposPermitidos.duracion = req.body.duracion;
    if (req.body.observaciones !== undefined) camposPermitidos.observaciones = req.body.observaciones;

    // Verificar que se envió al menos un campo
    if (Object.keys(camposPermitidos).length === 0) {
      return res.status(400).json({ mensaje: "No se enviaron campos para actualizar" });
    }

    const [actualizado] = await Ciclo.update(camposPermitidos, {
      where: { id_ciclo: id }
    });

    if (!actualizado) {
      return res.status(404).json({ mensaje: "Ciclo no encontrado" });
    }

    const cicloActualizado = await Ciclo.findByPk(id, {
      include: [
        { model: Bovino, as: "bovino" }
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
      where: { id_ciclo: req.params.id }
    });

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Ciclo no encontrado" });
    }

    res.json({ mensaje: "Ciclo eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
