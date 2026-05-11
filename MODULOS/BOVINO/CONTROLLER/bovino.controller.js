const { Bovino } = require("../MODEL");

/* INSERTAR */
exports.crear = async (req, res) => {
  try {
    const { id_grupo, numero_crotal, id_raza, nombre, fecha_nacimiento, nombre_madre, sexo, edad, estado, peso } = req.body;

    // 1. Limpieza y conversión de datos
    const cleanInt = (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const n = parseInt(String(val).replace(/\D/g, ''));
      return isNaN(n) ? null : n;
    };

    const cleanStr = (val, limit) => {
      if (!val) return null;
      return String(val).trim().substring(0, limit);
    };

    // 2. Datos procesados
    const datosFinales = {
      id_grupo:         cleanInt(id_grupo),
      id_raza:          cleanInt(id_raza),
      numero_crotal:    cleanInt(numero_crotal),
      nombre:           cleanStr(nombre, 30) || 'Sin nombre',
      fecha_nacimiento: fecha_nacimiento || null,
      nombre_madre:     cleanStr(nombre_madre, 30),
      sexo:             cleanStr(sexo, 6),
      edad:             cleanInt(edad),
      estado:           cleanStr(estado, 30),
      peso:             cleanStr(peso, 10)
    };

    // 3. Validación de campos obligatorios
    if (!datosFinales.id_grupo || !datosFinales.id_raza || !datosFinales.sexo || !datosFinales.estado) {
      return res.status(400).json({ 
        error: "Faltan campos obligatorios (Grupo, Raza, Sexo o Estado)",
        recibido: datosFinales 
      });
    }

    // 4. Intento de creación
    const bovino = await Bovino.create(datosFinales);
    res.status(201).json({ mensaje: "Bovino registrado correctamente", bovino });

  } catch (error) {
    console.error("ERROR CRÍTICO AL CREAR BOVINO:", error);
    
    let mensajeError = error.message;
    if (error.name === 'SequelizeUniqueConstraintError') mensajeError = "El Número de Crotal ya existe.";
    if (error.errors) mensajeError = error.errors.map(e => `${e.path}: ${e.message}`).join(", ");

    res.status(500).json({ 
      error: `Error de Base de Datos: ${mensajeError}`,
      tipo: error.name
    });
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
