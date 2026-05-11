// MODULOS/PROVEEDOR/CONTROLLER/proveedor.controller.js
const { Proveedor, Provincia } = require("../MODEL");

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({
      include: [{ model: Provincia, as: "provincia", attributes: ["nombre"] }]
    });
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
    const proveedor = await Proveedor.findByPk(id, {
      include: [{ model: Provincia, as: "provincia" }]
    });
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

    if (!nombre || !telefono || !id_provincia || !tipo_proveedor) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const proveedor = await Proveedor.create({
      nombre: nombre.trim(),
      rnc: rnc?.trim() || "N/A", // Si es null o vacío, poner N/A
      telefono: telefono.trim(),
      id_provincia: parseInt(id_provincia),
      tipo_proveedor: tipo_proveedor.trim(),
      estado: estado || "Activo"
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
    const { nombre, rnc, telefono, id_provincia, tipo_proveedor, estado } = req.body;

    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    await proveedor.update({
      nombre: nombre !== undefined ? nombre.trim() : proveedor.nombre,
      rnc: rnc !== undefined ? (rnc?.trim() || "N/A") : proveedor.rnc,
      telefono: telefono !== undefined ? telefono.trim() : proveedor.telefono,
      id_provincia: id_provincia !== undefined ? parseInt(id_provincia) : proveedor.id_provincia,
      tipo_proveedor: tipo_proveedor !== undefined ? tipo_proveedor.trim() : proveedor.tipo_proveedor,
      estado: estado || proveedor.estado
    });

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