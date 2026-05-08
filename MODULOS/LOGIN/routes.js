const express = require("express");
const router = express.Router();

const loginController = require("./CONTROLLER/login.controller");
const Login = require("./MODEL/login.model");
const bcrypt = require("bcrypt");

// LOGIN
router.post("/", loginController.login);

// UPDATE PASSWORD
router.put("/update-password", async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({ error: "Usuario y contraseña requeridos" });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    const resultado = await Login.update(
      { contrasena: hash },
      { where: { usuario } }
    );

    if (resultado[0] === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({ mensaje: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;