const { Bovino } = require("../MODEL");

/* INSERTAR */
exports.crear = async (req, res) => {
  try {
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

    // Solo validamos lo estrictamente necesario
    if (!id_grupo || !id_raza || !sexo || !estado) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const toInt = (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const parsed = parseInt(String(val).replace(/\D/g, '')); // Solo números
      return isNaN(parsed) ? null : parsed;
    };

    const bovino = await Bovino.create({
      id_grupo: toInt(id_grupo),
      numero_crotal: toInt(numero_crotal),
      id_raza: toInt(id_raza),
      nombre: nombre ? nombre.trim().substring(0, 30) : 'Sin nombre',
      fecha_nacimiento: fecha_nacimiento || null,
      nombre_madre: nombre_madre ? nombre_madre.trim().substring(0, 30) : null,
      sexo: sexo.trim().substring(0, 6),
      edad: toInt(edad),
      estado: estado.trim().substring(0, 30),
      peso: peso ? String(peso).substring(0, 10) : null
    });

    res.status(201).json({ mensaje: "Bovino registrado correctamente", bovino });
  } catch (error) {
    console.error("ERROR AL CREAR BOVINO (FULL):", error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: "El Número de Crotal ya existe para otro animal." });
    }
    
    if (error.name === 'SequelizeValidationError') {
      const msg = error.errors.map(e => `${e.path}: ${e.message}`).join(", ");
      return res.status(400).json({ error: `Error de validación: ${msg}` });
    }

    res.status(500).json({ error: error.message || "Error interno del servidor" });
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
    const { id_grupo, numero_crotal, id_raza, nombre, fecha_nacimiento, nombre_madre, sexo, edad, estado, peso } = req.body;

    const bovino = await Bovino.findByPk(id);
    if (!bovino) return res.status(404).json({ error: "Bovino no encontrado" });

    const toInt = (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const parsed = parseInt(String(val).replace(/\D/g, ''));
      return isNaN(parsed) ? null : parsed;
    };

    await bovino.update({
      id_grupo: id_grupo !== undefined ? toInt(id_grupo) : bovino.id_grupo,
      numero_crotal: numero_crotal !== undefined ? toInt(numero_crotal) : bovino.numero_crotal,
      id_raza: id_raza !== undefined ? toInt(id_raza) : bovino.id_raza,
      nombre: nombre !== undefined ? (nombre ? nombre.trim().substring(0, 30) : 'Sin nombre') : bovino.nombre,
      fecha_nacimiento: fecha_nacimiento === "" ? null : (fecha_nacimiento || bovino.fecha_nacimiento),
      nombre_madre: nombre_madre !== undefined ? (nombre_madre ? nombre_madre.trim().substring(0, 30) : null) : bovino.nombre_madre,
      sexo: sexo !== undefined ? sexo.trim().substring(0, 6) : bovino.sexo,
      edad: edad !== undefined ? toInt(edad) : bovino.edad,
      estado: estado !== undefined ? estado.trim().substring(0, 30) : bovino.estado,
      peso: peso !== undefined ? (peso ? String(peso).substring(0, 10) : null) : bovino.peso
    });

    res.json({ message: "Bovino actualizado correctamente", bovino });
  } catch (error) {
    console.error("ERROR ACTUALIZAR BOVINO:", error);
    const msg = error.errors ? error.errors.map(e => e.message).join(", ") : error.message;
    res.status(500).json({ error: msg });
  }
};
