const { Cliente, Provincia } = require("../MODEL");

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [{ model: Provincia, as: "provincia", attributes: ["nombre"] }],
      order: [["nombre", "ASC"]]
    });
    res.json(clientes);
  } catch (error) {
    console.error("ERROR LISTAR CLIENTE:", error);
    res.status(500).json({ error: error.message });
  }
};

/* OBTENER POR ID */
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id, {
      include: [{ model: Provincia, as: "provincia", attributes: ["nombre"] }]
    });
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(cliente);
  } catch (error) {
    console.error("ERROR OBTENER CLIENTE:", error);
    res.status(500).json({ error: error.message });
  }
};

/* CREAR */
exports.crear = async (req, res) => {
  try {
    const { rnc, telefono, correo, nombre, id_provincia, estado } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: "El nombre del cliente es obligatorio" });
    }

    const cliente = await Cliente.create({
      rnc:          rnc?.trim()      || null,
      telefono:     telefono?.trim() || null,
      correo:       correo?.trim()   || null,
      nombre:       nombre.trim(),
      id_provincia: id_provincia     || null,
      estado:       estado           || "activo"
    });

    res.status(201).json({ mensaje: "Cliente registrado correctamente", cliente });
  } catch (error) {
    console.error("ERROR CREAR CLIENTE:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ACTUALIZAR */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { rnc, telefono, correo, nombre, id_provincia, estado } = req.body;

    const cliente = await Cliente.findByPk(id);
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: "El nombre del cliente es obligatorio" });
    }

    await cliente.update({
      rnc:          rnc          ?? cliente.rnc,
      telefono:     telefono     ?? cliente.telefono,
      correo:       correo       ?? cliente.correo,
      nombre:       nombre.trim(),
      id_provincia: id_provincia ?? cliente.id_provincia,
      estado:       estado       ?? cliente.estado
    });

    res.json({ mensaje: "Cliente actualizado correctamente", cliente });
  } catch (error) {
    console.error("ERROR ACTUALIZAR CLIENTE:", error);
    res.status(500).json({ error: error.message });
  }
};
/* ELIMINAR */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
    await cliente.destroy();
    res.json({ mensaje: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR CLIENTE:", error);
    res.status(500).json({ error: error.message });
  }
};