const {
  Visita,
  Veterinario,
  Motivo
} = require("../MODEL");


const { Bovino, GrupoBovino } = require("../../BOVINO/MODEL");




exports.crear = async (req, res) => {
  try {
    console.log("BODY QUE LLEGA:", req.body);
    if (!req.body) {
      return res.status(400).json({ error: "No se enviaron datos" });
    }

    const { Id_veterinario, Id_bovino, fecha, motivos,observaciones,hora } = req.body;

    const visita = await Visita.create({
      Id_veterinario,
      Id_bovino,
      fecha,
      observaciones,
      hora
    });

    if (motivos && motivos.length > 0) {
      await visita.addMotivos(motivos);
    }

    res.json({ mensaje: "Visita insertada correctamente" });

  } catch (error) {
  console.error("ERROR COMPLETO:", error);
  console.error("ERROR SQL:", error.parent);
  res.status(500).json({ error: error.message });
}

};



/* 
   OBTENER VISITA POR ID
 */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const visita = await Visita.findByPk(id, {
      include: [
        { model: Veterinario },
        { model: Bovino },
        { model: Motivo, through: { attributes: [] } }
      ]
    });

    if (!visita) {
      return res.status(404).json({ mensaje: "Visita no encontrada" });
    }

    res.json(visita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* LISTAR VISITAS */
exports.listar = async (req, res) => {
  try {
    const visitas = await Visita.findAll({
      include: [
        {
          model: Veterinario,
          as: "VETERINARIO",
          attributes: ["nombre"]
        },
        {
          model: Bovino,
          as: "BOVINO",
          attributes: ["nombre", "numero_crotal", "sexo"],
          include: [
            {
              model: GrupoBovino,
              as: "GRUPO_BOVINO",
              attributes: ["nombre"]
            }
          ]
        },
        {
          model: Motivo,
          as: "Motivos",
          attributes: ["motivo"],
          through: { attributes: [] }
        }
      ]
    });

    const resultado = visitas.map(v => ({
  veterinario: v.VETERINARIO ? v.VETERINARIO.nombre : null,
  animal: v.BOVINO ? v.BOVINO.nombre : null,
  crotal: v.BOVINO ? v.BOVINO.numero_crotal : null,
  sexo: v.BOVINO ? v.BOVINO.sexo : null,
  grupo:
    v.BOVINO && v.BOVINO.GRUPO_BOVINO
      ? v.BOVINO.GRUPO_BOVINO.nombre
      : null,
  fecha: v.fecha,
  hora: v.hora,                
      observaciones: v.observaciones, 
  motivos: v.Motivos ? v.Motivos.map(m => m.motivo) : []
}));

    res.json(resultado);

  } catch (error) {
    console.error("ERROR LISTAR VISITAS:", error);
    res.status(500).json({ error: error.message });
  }
};


/* 
   ELIMINAR VISITA
 */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    await Visita.destroy({
      where: { Id_visita: id }
    });

    res.json({ mensaje: "Visita eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

console.log("🚀 visita.controller cargado");

