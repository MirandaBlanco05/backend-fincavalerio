const Login = require("../MODEL/login.model");

exports.login = async (req, res) => {
  try {
    const { Usuario, Contraseña } = req.body;

    if (!Usuario || !Contraseña) {
      return res.status(400).json({
        error: "Usuario y contraseña son obligatorios"
      });
    }

    const usuario = await Login.findOne({
      where: {
        Usuario: Usuario,
        Contraseña: Contraseña
      }
    });

    if (!usuario) {
      return res.status(401).json({
        error: "Credenciales incorrectas"
      });
    }

    res.json({
      mensaje: "Login correcto",
      usuario: usuario.Usuario,
      tipo: usuario.Tipo_usuario
    });

  } catch (error) {
    console.error("ERROR LOGIN:", error);
    res.status(500).json({ error: error.message });
  }
};
