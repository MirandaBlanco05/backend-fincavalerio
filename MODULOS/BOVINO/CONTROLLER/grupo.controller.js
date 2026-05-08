const { GrupoBovino } = require("../MODEL");

exports.listar = async (req, res) => {
  try {
    const grupos = await GrupoBovino.findAll();
    res.json(grupos);
  } catch (error) {
    console.error("ERROR LISTAR GRUPOS:", error);
    res.status(500).json({ error: error.message });
  }
};
