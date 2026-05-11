const { Ciclo, Bovino } = require("../MODEL");

const toInt = (val) => {
  if (val === "" || val === null || val === undefined) return null;
  const parsed = parseInt(String(val).replace(/\D/g, ''));
  return isNaN(parsed) ? null : parsed;
};

// 🔹 Crear
exports.crearCiclo = async (req, res) => {
  console.log("📥 PETICION RECIBIDA - CREAR CICLO:", JSON.stringify(req.body, null, 2));
  try {
    const { id_bovino, fecha_inicio, fecha_fin, duracion, observaciones } = req.body;

    if (!id_bovino) return res.status(400).json({ error: "Debe seleccionar un animal" });
    if (!fecha_inicio) return res.status(400).json({ error: "La fecha de inicio es obligatoria" });
    if (!fecha_fin) return res.status(400).json({ error: "La fecha de fin es obligatoria" });

    const nuevo = await Ciclo.create({
      id_bovino:     toInt(id_bovino),
      fecha_inicio:  fecha_inicio,
      fecha_fin:     fecha_fin,
      duracion:      toInt(duracion),
      observaciones: observaciones?.trim() || null
    });

    res.status(201).json({ mensaje: "Ciclo de celo registrado correctamente", ciclo: nuevo });
  } catch (error) {
    console.error("ERROR CREAR CICLO:", error);
    let errorMsg = error.message;
    if (error.name === 'SequelizeValidationError') {
      errorMsg = error.errors.map(e => `${e.path}: ${e.message}`).join(', ');
    }
    res.status(500).json({ error: `Error de Base de Datos: ${errorMsg}` });
  }
};

//listar
exports.obtenerCiclos = async (req, res) => {
  try {
    const lista = await Ciclo.findAll({
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
  const { id } = req.params;
  console.log(`📥 PETICION RECIBIDA - ACTUALIZAR CICLO #${id}:`, JSON.stringify(req.body, null, 2));
  try {
    const { id_bovino, fecha_inicio, fecha_fin, duracion, observaciones } = req.body;

    const ciclo = await Ciclo.findByPk(id);
    if (!ciclo) {
      return res.status(404).json({ error: "Ciclo no encontrado" });
    }

    await ciclo.update({
      id_bovino:     id_bovino     !== undefined ? toInt(id_bovino) : ciclo.id_bovino,
      fecha_inicio:  fecha_inicio  !== undefined ? (fecha_inicio || null) : ciclo.fecha_inicio,
      fecha_fin:     fecha_fin     !== undefined ? (fecha_fin || null) : ciclo.fecha_fin,
      duracion:      duracion      !== undefined ? toInt(duracion) : ciclo.duracion,
      observaciones: observaciones !== undefined ? (observaciones?.trim() || null) : ciclo.observaciones
    });

    const cicloActualizado = await Ciclo.findByPk(id, {
      include: [
        { model: Bovino, as: "bovino" }
      ]
    });

    res.json({ mensaje: "Ciclo actualizado correctamente", ciclo: cicloActualizado });
  } catch (error) {
    console.error("ERROR ACTUALIZAR CICLO:", error);
    let errorMsg = error.message;
    if (error.name === 'SequelizeValidationError') {
      errorMsg = error.errors.map(e => `${e.path}: ${e.message}`).join(', ');
    }
    res.status(500).json({ error: `Error de Base de Datos: ${errorMsg}` });
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
