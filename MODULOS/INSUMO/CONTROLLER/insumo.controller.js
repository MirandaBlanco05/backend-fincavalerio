const { Insumo } = require("../MODEL");

exports.listar = async (req, res) => {
  try {
    const insumos = await Insumo.findAll({ order: [["id_insumo", "DESC"]] });
    res.json(insumos);
  } catch (error) {
    console.error("ERROR LISTAR INSUMOS:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await Insumo.findByPk(id);
    if (!insumo) return res.status(404).json({ error: "Insumo no encontrado" });
    res.json(insumo);
  } catch (error) {
    console.error("ERROR OBTENER INSUMO:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, tipo_insumo, uso, fecha_vencimiento, cantidad_stock, precio, estado } = req.body;

    if (!nombre || !tipo_insumo || !uso) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const insumo = await Insumo.create({
      nombre: nombre.trim(),
      tipo_insumo: tipo_insumo.trim(),
      uso: uso.trim(),
      fecha_vencimiento: fecha_vencimiento || null,
      cantidad_stock: parseInt(cantidad_stock) || 0,
      precio: parseFloat(precio) || 0,
      estado: estado || "Activo"
    });

    res.status(201).json({ mensaje: "Insumo registrado correctamente", insumo });
  } catch (error) {
    console.error("ERROR CREAR INSUMO:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo_insumo, uso, fecha_vencimiento, cantidad_stock, precio, estado } = req.body;

    console.log(`ACTUALIZANDO INSUMO ID: ${id}`);

    const insumo = await Insumo.findByPk(id);
    if (!insumo) {
      return res.status(404).json({ error: `Insumo con ID ${id} no encontrado para actualizar` });
    }

    // Actualizar campos uno por uno para asegurar persistencia
    if (nombre !== undefined)            insumo.nombre = nombre.trim();
    if (tipo_insumo !== undefined)       insumo.tipo_insumo = tipo_insumo.trim();
    if (uso !== undefined)               insumo.uso = uso.trim();
    if (fecha_vencimiento !== undefined) insumo.fecha_vencimiento = fecha_vencimiento || null;
    if (cantidad_stock !== undefined)    insumo.cantidad_stock = parseInt(cantidad_stock);
    if (precio !== undefined)            insumo.precio = parseFloat(precio);
    if (estado !== undefined)            insumo.estado = estado;

    await insumo.save();

    res.json({ mensaje: "Insumo actualizado correctamente (BACKEND FIX V1)", insumo });
  } catch (error) {
    console.error("ERROR ACTUALIZAR INSUMO:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await Insumo.findByPk(id);
    if (!insumo) return res.status(404).json({ error: "Insumo no encontrado" });

    await insumo.destroy();
    res.json({ mensaje: "Insumo eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR INSUMO:", error);
    res.status(500).json({ error: error.message });
  }
};