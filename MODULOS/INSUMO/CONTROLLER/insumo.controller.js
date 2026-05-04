const { Insumo } = require("../MODEL");

exports.listar = async (req, res) => {
  try {
    const insumos = await Insumo.findAll();
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

    if (!nombre || !tipo_insumo || !uso || !estado) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const insumo = await Insumo.create({
      nombre, tipo_insumo, uso, fecha_vencimiento, cantidad_stock, precio, estado
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
    const insumo = await Insumo.findByPk(id);
    if (!insumo) return res.status(404).json({ error: "Insumo no encontrado" });

    await insumo.update(req.body);
    res.json({ mensaje: "Insumo actualizado correctamente", insumo });
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