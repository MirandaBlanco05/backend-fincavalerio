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

    // Solo validamos lo estrictamente necesario para que la DB no explote
    if (!id_grupo || !id_raza || !sexo || !estado) {
      return res.status(400).json({
        error: "Faltan campos obligatorios (Grupo, Raza, Sexo o Estado)"
      });
    }

    const toInt = (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const parsed = parseInt(val);
      return isNaN(parsed) ? null : parsed;
    };

    const bovino = await Bovino.create({
      id_grupo: toInt(id_grupo),
      numero_crotal: toInt(numero_crotal),
      id_raza: toInt(id_raza),
      nombre: nombre || 'Sin nombre',
      fecha_nacimiento: fecha_nacimiento || null,
      nombre_madre,
      sexo,
      edad: toInt(edad),
      estado,
      peso: (peso === "" || peso === null) ? null : peso
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

/* ACTUALIZAR */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const bovino = await Bovino.findByPk(id);

    if (!bovino) {
      return res.status(404).json({ error: "Bovino no encontrado" });
    }

    const cleanData = { ...datos };
    const toInt = (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const parsed = parseInt(val);
      return isNaN(parsed) ? null : parsed;
    };
    
    if (cleanData.id_grupo !== undefined) cleanData.id_grupo = toInt(cleanData.id_grupo);
    if (cleanData.id_raza !== undefined) cleanData.id_raza = toInt(cleanData.id_raza);
    if (cleanData.numero_crotal !== undefined) cleanData.numero_crotal = toInt(cleanData.numero_crotal);
    if (cleanData.edad !== undefined) cleanData.edad = toInt(cleanData.edad);
    if (cleanData.peso !== undefined && (cleanData.peso === "" || cleanData.peso === null)) cleanData.peso = null;

    await bovino.update(cleanData);

    res.json({
      message: "Bovino actualizado correctamente",
      bovino
    });

  } catch (error) {
    console.error("ERROR ACTUALIZAR BOVINO:", error);
    res.status(500).json({ error: error.message });
  }
};
