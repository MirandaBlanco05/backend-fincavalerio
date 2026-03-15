const Cliente = require("../MODEL/cliente.model");
const Provincia = require("../MODEL/provincia.model");

//Obtener todos
exports.obtenerClientes = async (req, res) => {
  try {
    const lista = await Cliente.findAll({
      attributes: { exclude: ["id_provincia"] },
      include: [
        {
          model: Provincia,
          as: "provincia",
          attributes: ["id_provincia", "nombre"]
        }
      ]
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obtener por ID
exports.obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id, {
      include: [
        {
          model: Provincia,
          as: "provincia",
          attributes: ["id_provincia", "nombre"]
        }
      ]
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Crear
exports.crearCliente = async (req, res) => {
  try {
    const nuevo = await Cliente.create(req.body);

    const clienteCreado = await Cliente.findByPk(nuevo.Id_cliente, {
      include: [
        {
          model: Provincia,
          as: "provincia",
          attributes: ["id_provincia", "nombre"]
        }
      ]
    });

    res.status(201).json({
      message: "Cliente creado correctamente",
      cliente: clienteCreado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Actualizar
exports.actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    await cliente.update(req.body);

    const clienteActualizado = await Cliente.findByPk(id, {
      include: [
        {
          model: Provincia,
          as: "provincia",
          attributes: ["id_provincia", "nombre"]
        }
      ]
    });

    res.json({
      message: "Cliente actualizado correctamente",
      cliente: clienteActualizado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Eliminar
exports.eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    await cliente.destroy();

    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};