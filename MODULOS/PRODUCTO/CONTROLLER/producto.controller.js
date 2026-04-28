const { Producto } = require("../MODEL");

/* LISTAR */
exports.listar = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error("ERROR LISTAR PRODUCTOS:", error);
    res.status(500).json({ error: error.message });
  }
};

/* CREAR */
exports.crear = async (req, res) => {
  try {
    const { Cantidad_stock, Tipo_producto, precio_costo, peso, precio_venta, Descripcion } = req.body;

    if (!Cantidad_stock || !Tipo_producto || !precio_costo || precio_venta === undefined) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const producto = await Producto.create({
      Cantidad_stock, Tipo_producto, precio_costo, peso, precio_venta, Descripcion
    });

    res.status(201).json({ mensaje: "Producto registrado correctamente", producto });
  } catch (error) {
    console.error("ERROR CREAR PRODUCTO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ACTUALIZAR */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    await producto.update(req.body);
    res.json({ mensaje: "Producto actualizado correctamente", producto });
  } catch (error) {
    console.error("ERROR ACTUALIZAR PRODUCTO:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ELIMINAR */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    await producto.destroy();
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR PRODUCTO:", error);
    res.status(500).json({ error: error.message });
  }
};