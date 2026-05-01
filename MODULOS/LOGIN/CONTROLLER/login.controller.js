const Login = require("../MODEL/login.model");

exports.login = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }

    const encontrado = await Login.findOne({
      where: {
        usuario: usuario,
        contrasena: contrasena
      }
    });

    if (!encontrado) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    res.json({
      mensaje: "Login correcto",
      usuario: encontrado.usuario,
      tipo: encontrado.tipo_usuario
    });

  } catch (error) {
    console.error("ERROR LOGIN:", error);
    res.status(500).json({ error: error.message });
  }
};