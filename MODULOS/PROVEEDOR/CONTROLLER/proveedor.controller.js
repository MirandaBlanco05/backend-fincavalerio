// MODULOS/PROVEEDOR/CONTROLLER/proveedor.controller.js
const { Proveedor } = require("../MODEL");

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    console.error("ERROR LISTAR PROVEEDORES:", error);
    res.status(500).json({ error: error.message });
  }
};

/* OBTENER POR ID */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json(proveedor);
  } catch (error) {
    console.error("ERROR OBTENER PROVEEDOR:", error);
    res.status(500).json({ error: error.message });
  }
};

/* CREAR */
exports.crear = async (req, res) => {
  try {
    const { nombre, rnc, telefono, id_provincia, tipo_proveedor, estado } = req.body;

    if (!nombre || !rnc || !telefono || !id_provincia || !tipo_proveedor || !estado) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const proveedor = await Proveedor.create({
      nombre,
      rnc,
      telefono,
      id_provincia,
      tipo_proveedor,
      estado
    });

    res.status(201).json({ mensaje: "Proveedor registrado correctamente", proveedor });
  } catch (error) {
    console.error("ERROR CREAR PROVEEDOR:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ACTUALIZAR */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    await proveedor.update(datos);
    res.json({ mensaje: "Proveedor actualizado correctamente", proveedor });
  } catch (error) {
    console.error("ERROR ACTUALIZAR PROVEEDOR:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ELIMINAR */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    await proveedor.destroy();
    res.json({ mensaje: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR PROVEEDOR:", error);
    res.status(500).json({ error: error.message });
  }
};