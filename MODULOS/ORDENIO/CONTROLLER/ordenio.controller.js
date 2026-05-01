// MODULOS/ORDENIO/CONTROLLER/ordenio.controller.js
const { Ordenio, Bovino } = require("../MODEL");

/* ── CREAR ─────────────────────────────────────────────────────────────────── */
exports.crear = async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);

    const { id_bovino, id_empleado, fecha, momento_dia, cantidad_total } = req.body;

    if (!id_bovino || !id_empleado) {
      return res.status(400).json({
        error: "Faltan campos obligatorios: Id_bovino e Id_empleado son requeridos"
      });
    }

    if (momento_dia && !["Mañana", "Tarde"].includes(momento_dia)) {
      return res.status(400).json({
        error: "Momento_dia solo puede ser 'Mañana' o 'Tarde'"
      });
    }

    const ordenio = await Ordenio.create({
      id_bovino,
      id_empleado,
      fecha,
      momento_dia,
      cantidad_total
    });

    res.status(201).json({
      mensaje: "Ordeño registrado correctamente",
      ordenio
    });
  } catch (error) {
    console.error("ERROR CREAR ORDENIO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ── LISTAR ────────────────────────────────────────────────────────────────── */
exports.listar = async (req, res) => {
  try {
    console.log("Petición para listar ordeños recibida");

    const ordenos = await Ordenio.findAll({
      include: [
        {
          model: Bovino,
          as: "BOVINO",
          attributes: ["nombre", "numero_crotal"]
        }
        
       // {
       // model: Empleado,
        //as: "EMPLEADO",
          //attributes: ["nombre"]
        //}
      ],
      order: [["fecha", "DESC"]]
    });

    res.json(ordenos);
  } catch (error) {
    console.error("ERROR LISTAR ORDENOS:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ── OBTENER POR ID ─────────────────────────────────────────────────────────── */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const ordenio = await Ordenio.findByPk(id, {
      include: [
        { model: Bovino, as: "BOVINO", attributes: ["nombre", "numero_crotal"] }
      ]
    });

    if (!ordenio) {
      return res.status(404).json({ error: "Ordeño no encontrado" });
    }

    res.json(ordenio);
  } catch (error) {
    console.error("ERROR OBTENER ORDENIO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ── ACTUALIZAR ─────────────────────────────────────────────────────────────── */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    if (datos.momento_dia && !["Mañana", "Tarde"].includes(datos.momento_dia)) {
      return res.status(400).json({
        error: "Momento_dia solo puede ser 'Mañana' o 'Tarde'"
      });
    }

    const ordenio = await Ordenio.findByPk(id);

    if (!ordenio) {
      return res.status(404).json({ error: "Ordeño no encontrado" });
    }

    await ordenio.update(datos);

    res.json({
      mensaje: "Ordeño actualizado correctamente",
      ordenio
    });
  } catch (error) {
    console.error("ERROR ACTUALIZAR ORDENIO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ── ELIMINAR ───────────────────────────────────────────────────────────────── */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const ordenio = await Ordenio.findByPk(id);

    if (!ordenio) {
      return res.status(404).json({ error: "Ordeño no encontrado" });
    }

    await ordenio.destroy();

    res.json({ mensaje: "Ordeño eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR ORDENIO:", error);
    res.status(500).json({ error: error.message });
  }
};

console.log("🚀 ordenio.controller cargado");