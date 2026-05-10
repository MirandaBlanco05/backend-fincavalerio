const { Vacuna, DetalleVacuna } = require("../MODEL");
const { sequelize } = require("../../../CORE/DATABASE/sequelize");

// Listar todas las vacunas con sus detalles
exports.listar = async (req, res) => {
  try {
    const vacunas = await Vacuna.findAll({
      include: [{
        model: DetalleVacuna,
        as: 'detalles'
      }],
      order: [["fecha", "DESC"]]
    });
    res.json(vacunas);
  } catch (error) {
    console.error("Error al listar vacunas:", error);
    res.status(500).json({ error: "Error al listar vacunas" });
  }
};

// Listar vacunas por bovino
exports.listarPorBovino = async (req, res) => {
  try {
    const { id_bovino } = req.params;
    
    const detalles = await DetalleVacuna.findAll({
      where: { id_bovino },
      include: [{
        model: Vacuna,
        as: 'vacuna'
      }],
      order: [[{ model: Vacuna, as: 'vacuna' }, 'fecha', 'DESC']]
    });
    
    res.json(detalles);
  } catch (error) {
    console.error("Error al listar vacunas por bovino:", error);
    res.status(500).json({ error: "Error al listar vacunas por bovino" });
  }
};

// Obtener vacuna por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vacuna = await Vacuna.findByPk(id, {
      include: [{
        model: DetalleVacuna,
        as: 'detalles'
      }]
    });
    
    if (!vacuna) {
      return res.status(404).json({ error: "Vacuna no encontrada" });
    }
    
    res.json(vacuna);
  } catch (error) {
    console.error("Error al obtener vacuna:", error);
    res.status(500).json({ error: "Error al obtener vacuna" });
  }
};

// Crear vacuna con detalle
exports.crear = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id_insumo, tipo_vacuna, fecha, id_bovino, id_empleado } = req.body;
    
    // Crear vacuna
    const nuevaVacuna = await Vacuna.create({
      id_insumo,
      tipo_vacuna,
      fecha
    }, { transaction });
    
    // Crear detalle
    await DetalleVacuna.create({
      id_vacuna: nuevaVacuna.id_vacuna,
      id_bovino,
      id_empleado
    }, { transaction });
    
    await transaction.commit();
    
    res.status(201).json(nuevaVacuna);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al crear vacuna:", error);
    res.status(500).json({ error: "Error al crear vacuna" });
  }
};

// Actualizar vacuna
exports.actualizar = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { id_insumo, tipo_vacuna, fecha, id_bovino, id_empleado } = req.body;
    
    const vacuna = await Vacuna.findByPk(id);
    
    if (!vacuna) {
      await transaction.rollback();
      return res.status(404).json({ error: "Vacuna no encontrada" });
    }
    
    // Actualizar vacuna
    await vacuna.update({
      id_insumo,
      tipo_vacuna,
      fecha
    }, { transaction });
    
    // Actualizar detalle
    await DetalleVacuna.update({
      id_bovino,
      id_empleado
    }, {
      where: { id_vacuna: id },
      transaction
    });
    
    await transaction.commit();
    
    res.json(vacuna);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al actualizar vacuna:", error);
    res.status(500).json({ error: "Error al actualizar vacuna" });
  }
};

// Eliminar vacuna
exports.eliminar = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const vacuna = await Vacuna.findByPk(id);
    
    if (!vacuna) {
      await transaction.rollback();
      return res.status(404).json({ error: "Vacuna no encontrada" });
    }
    
    // Eliminar detalle primero
    await DetalleVacuna.destroy({
      where: { id_vacuna: id },
      transaction
    });
    
    // Eliminar vacuna
    await vacuna.destroy({ transaction });
    
    await transaction.commit();
    
    res.json({ mensaje: "Vacuna eliminada correctamente" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al eliminar vacuna:", error);
    res.status(500).json({ error: "Error al eliminar vacuna" });
  }
};