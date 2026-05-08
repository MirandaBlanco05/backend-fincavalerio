const { Raza } = require("../MODEL");

exports.listar = async (req, res) => {
  try {
    const razas = await Raza.findAll();
    res.json(razas);
  } catch (error) {
    console.error("ERROR LISTAR RAZAS:", error);
    res.status(500).json({ error: error.message });
  }
};
