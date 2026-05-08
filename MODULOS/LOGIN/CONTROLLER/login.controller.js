const Login = require("../MODEL/login.model");
const bcrypt = require("bcrypt");

// 🔐 LOGIN
exports.login = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }

    const encontrado = await Login.findOne({
      where: { usuario }
    });

    if (!encontrado) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const passwordValida = await bcrypt.compare(
      contrasena,
      encontrado.contrasena
    );

    if (!passwordValida) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    return res.json({
      mensaje: "Login correcto",
      usuario: encontrado.usuario,
      tipo: encontrado.tipo_usuario
    });

  } catch (error) {
    console.error("ERROR LOGIN:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};