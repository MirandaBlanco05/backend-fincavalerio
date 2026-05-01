const { Bovino } = require("../MODEL");

/* INSERTAR */
exports.crear = async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);

    const {
      id_grupo,
      numero_crotal,
      id_raza,
      nombre,
      fecha_nacimiento,
      nombre_madre,
      sexo,
      edad,
      estado,
      peso
    } = req.body;

    // Validaciones basicas obligatorias
    if (
      !id_grupo ||
      !id_raza ||
      !nombre ||
      !fecha_nacimiento ||
      !sexo ||
      !estado
    ) {
      return res.status(400).json({
        error: "Faltan campos obligatorios para registrar el bovino"
      });
    }

    const bovino = await Bovino.create({
      id_grupo,
      numero_crotal,
      id_raza,
      nombre,
      fecha_nacimiento,
      nombre_madre,
      sexo,
      edad,
      estado,
      peso
    });

    res.status(201).json({
      mensaje: "Bovino registrado correctamente",
      bovino
    });
  } catch (error) {
    console.error("ERROR CREAR BOVINO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* LISTAR */
exports.listar = async (req, res) => {
  try {
     console.log("peticion para listar recibida", req.body);
    const bovinos = await Bovino.findAll();
    res.json(bovinos);
  } catch (error) {
    console.error("ERROR LISTAR BOVINOS:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ELIMINAR */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const bovino = await Bovino.findByPk(id);

    if (!bovino) {
      return res.status(404).json({ error: "Bovino no encontrado" });
    }

    await bovino.destroy();

    res.json({ message: "Bovino eliminado correctamente" });

  } catch (error) {
    console.error("ERROR ELIMINAR BOVINO:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const bovino = await Bovino.findByPk(id);

    if (!bovino) {
      return res.status(404).json({ error: "Bovino no encontrado" });
    }

    await bovino.update(datos);

    res.json({
      message: "Bovino actualizado correctamente",
      bovino
    });

  } catch (error) {
    console.error("ERROR ACTUALIZAR BOVINO:", error);
    res.status(500).json({ error: error.message });
  }
};


