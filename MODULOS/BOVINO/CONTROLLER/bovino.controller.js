const { Bovino } = require("../MODEL");

// Helper para limpiar strings y números
const cleanStr = (val, max) => val ? String(val).trim().substring(0, max) : null;
const cleanInt = (val) => {
  if (val === "" || val === null || val === undefined) return null;
  const parsed = parseInt(String(val).replace(/\D/g, ''));
  return isNaN(parsed) ? null : parsed;
};

/* CREAR */
exports.crear = async (req, res) => {
  try {
    const { id_grupo, numero_crotal, id_raza, nombre, fecha_nacimiento, nombre_madre, sexo, edad, estado, peso } = req.body;

    const nuevoBovino = await Bovino.create({
      id_grupo:         cleanInt(id_grupo),
      numero_crotal:    numero_crotal ? BigInt(numero_crotal) : null,
      id_raza:          cleanInt(id_raza),
      nombre:           cleanStr(nombre, 30) || "Sin nombre",
      fecha_nacimiento: fecha_nacimiento     || null,
      nombre_madre:     cleanStr(nombre_madre, 30),
      sexo:             sexo                 || "Macho",
      edad:             cleanInt(edad),
      estado:           cleanStr(estado, 30) || "Activo",
      peso:             cleanStr(peso, 10)
    });

    res.status(201).json({ mensaje: "Animal registrado correctamente", bovino: nuevoBovino });
  } catch (error) {
    console.error("ERROR CREAR BOVINO:", error);
    let errorMsg = error.message;
    if (error.name === 'SequelizeValidationError') {
      errorMsg = error.errors.map(e => `${e.path}: ${e.message}`).join(', ');
    }
    res.status(500).json({ error: `Error de Base de Datos: ${errorMsg}` });
  }
};

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const bovinos = await Bovino.findAll({
      order: [["id_bovino", "DESC"]]
    });
    res.json(bovinos);
  } catch (error) {
    console.error("ERROR LISTAR BOVINOS:", error);
    res.status(500).json({ error: error.message });
  }
};

/* OBTENER POR ID */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const bovino = await Bovino.findByPk(id);
    if (!bovino) return res.status(404).json({ error: "Animal no encontrado" });
    res.json(bovino);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ACTUALIZAR */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_grupo, numero_crotal, id_raza, nombre, fecha_nacimiento, nombre_madre, sexo, edad, estado, peso } = req.body;

    const bovino = await Bovino.findByPk(id);
    if (!bovino) {
      return res.status(404).json({ error: `El animal con ID ${id} no existe en la base de datos.` });
    }

    await bovino.update({
      id_grupo:         id_grupo !== undefined ? cleanInt(id_grupo) : bovino.id_grupo,
      numero_crotal:    numero_crotal !== undefined ? (numero_crotal ? BigInt(numero_crotal) : null) : bovino.numero_crotal,
      id_raza:          id_raza !== undefined ? cleanInt(id_raza) : bovino.id_raza,
      nombre:           nombre !== undefined ? cleanStr(nombre, 30) : bovino.nombre,
      fecha_nacimiento: fecha_nacimiento !== undefined ? (fecha_nacimiento || null) : bovino.fecha_nacimiento,
      nombre_madre:     nombre_madre !== undefined ? cleanStr(nombre_madre, 30) : bovino.nombre_madre,
      sexo:             sexo !== undefined ? sexo : bovino.sexo,
      edad:             edad !== undefined ? cleanInt(edad) : bovino.edad,
      estado:           estado !== undefined ? cleanStr(estado, 30) : bovino.estado,
      peso:             peso !== undefined ? cleanStr(peso, 10) : bovino.peso
    });

    res.json({ mensaje: "Animal actualizado correctamente", bovino });
  } catch (error) {
    console.error("ERROR ACTUALIZAR BOVINO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ELIMINAR */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const bovino = await Bovino.findByPk(id);
    if (!bovino) return res.status(404).json({ error: "Animal no encontrado" });

    await bovino.destroy();
    res.json({ mensaje: "Animal eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR BOVINO:", error);
    res.status(500).json({ error: error.message });
  }
};
