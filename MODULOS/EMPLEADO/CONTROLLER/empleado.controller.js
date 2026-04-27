// MODULOS/EMPLEADO/CONTROLLER/empleado.controller.js
const { Empleado } = require("../MODEL");

/* ── CREAR ─────────────────────────────────────────────────────────────────── */
exports.crear = async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);

    const { nombre, nacionalidad, cedula, telefono, salario } = req.body;

    if (!nombre || !nacionalidad || !telefono) {
      return res.status(400).json({
        error: "Faltan campos obligatorios: nombre, nacionalidad y teléfono son requeridos"
      });
    }

    const empleado = await Empleado.create({
      nombre,
      nacionalidad,
      cedula,
      telefono,
      salario
    });

    res.status(201).json({
      mensaje: "Empleado registrado correctamente",
      empleado
    });
  } catch (error) {
    console.error("ERROR CREAR EMPLEADO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ── LISTAR ────────────────────────────────────────────────────────────────── */
exports.listar = async (req, res) => {
  try {
    console.log("Petición para listar empleados recibida");
    const empleados = await Empleado.findAll({
      order: [["nombre", "ASC"]]
    });
    res.json(empleados);
  } catch (error) {
    console.error("ERROR LISTAR EMPLEADOS:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ── OBTENER POR ID ─────────────────────────────────────────────────────────── */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    res.json(empleado);
  } catch (error) {
    console.error("ERROR OBTENER EMPLEADO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ── ACTUALIZAR ─────────────────────────────────────────────────────────────── */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    await empleado.update(datos);

    res.json({
      mensaje: "Empleado actualizado correctamente",
      empleado
    });
  } catch (error) {
    console.error("ERROR ACTUALIZAR EMPLEADO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ── ELIMINAR ───────────────────────────────────────────────────────────────── */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    await empleado.destroy();

    res.json({ mensaje: "Empleado eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR EMPLEADO:", error);
    res.status(500).json({ error: error.message });
  }
};

console.log("🚀 empleado.controller cargado");