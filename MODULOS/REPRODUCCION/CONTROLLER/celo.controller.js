const Ciclo = require("../MODEL/celo.model");
const Bovino = require("../../BOVINO/MODEL/bovino.model");

const toInt = (val) => (val !== undefined && val !== null && val !== "") ? parseInt(val) : null;

// 🔹 Crear
exports.crearCiclo = async (req, res) => {
  try {
    const { id_bovino, fecha_inicio, fecha_fin, duracion, observaciones } = req.body;

    const nuevo = await Ciclo.create({
      id_bovino: toInt(id_bovino),
      fecha_inicio: fecha_inicio || null,
      fecha_fin: fecha_fin || null,
      duracion: toInt(duracion),
      observaciones: observaciones?.trim() || null
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error("ERROR CREAR CICLO:", error);
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
          attributes: ["id_bovino", "nombre", "numero_crotal"]
        }
      ],
      order: [["fecha_inicio", "DESC"]]
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
        { model: Bovino, as: "bovino" }
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

// 🔹 Actualizar
exports.actualizarCiclo = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_bovino, fecha_inicio, fecha_fin, duracion, observaciones } = req.body;

    const ciclo = await Ciclo.findByPk(id);
    if (!ciclo) {
      return res.status(404).json({ mensaje: "Ciclo no encontrado" });
    }

    await ciclo.update({
      id_bovino:     id_bovino !== undefined ? toInt(id_bovino) : ciclo.id_bovino,
      fecha_inicio:  fecha_inicio !== undefined ? (fecha_inicio || null) : ciclo.fecha_inicio,
      fecha_fin:     fecha_fin !== undefined ? (fecha_fin || null) : ciclo.fecha_fin,
      duracion:      duracion !== undefined ? toInt(duracion) : ciclo.duracion,
      observaciones: observaciones !== undefined ? (observaciones?.trim() || null) : ciclo.observaciones
    });

    const cicloActualizado = await Ciclo.findByPk(id, {
      include: [
        { model: Bovino, as: "bovino" }
      ]
    });

    res.json(cicloActualizado);
  } catch (error) {
    console.error("ERROR ACTUALIZAR CICLO:", error);
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
