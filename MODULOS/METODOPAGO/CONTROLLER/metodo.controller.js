const MetodoPago = require("../MODEL");

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const metodos = await MetodoPago.findAll({ order: [["tipo_metodo", "ASC"]] });
    res.json(metodos);
  } catch (error) {
    console.error("ERROR LISTAR METODO_PAGO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* OBTENER */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) return res.status(404).json({ error: "Método de pago no encontrado" });
    res.json(metodo);
  } catch (error) {
    console.error("ERROR OBTENER METODO_PAGO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* CREAR */
exports.crear = async (req, res) => {
  try {
    const { tipo_metodo } = req.body;
    if (!tipo_metodo?.trim()) {
      return res.status(400).json({ error: "El tipo de método es obligatorio" });
    }
    const metodo = await MetodoPago.create({ tipo_metodo: tipo_metodo.trim() });
    res.status(201).json({ mensaje: "Método de pago registrado correctamente", metodo });
  } catch (error) {
    console.error("ERROR CREAR METODO_PAGO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ACTUALIZAR */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_metodo } = req.body;
    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) return res.status(404).json({ error: "Método de pago no encontrado" });
    await metodo.update({ tipo_metodo: tipo_metodo?.trim() ?? metodo.tipo_metodo });
    res.json({ mensaje: "Método de pago actualizado correctamente", metodo });
  } catch (error) {
    console.error("ERROR ACTUALIZAR METODO_PAGO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ELIMINAR */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) return res.status(404).json({ error: "Método de pago no encontrado" });
    await metodo.destroy();
    res.json({ mensaje: "Método de pago eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR METODO_PAGO:", error);
    res.status(500).json({ error: error.message });
  }
};