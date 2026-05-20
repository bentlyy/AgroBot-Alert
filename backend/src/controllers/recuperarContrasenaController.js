const crypto = require('crypto');
const User = require('../models/recuperacionModel');
const enviarCorreoRecuperacion = require('../utils/emailService');

const recuperarContrasenaController = {};

recuperarContrasenaController.solicitarRecuperacion = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      res.status(404).send({ message: 'No existe una cuenta con ese correo electrónico' });
      return;
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expire = Date.now() + 3600000;

    const userInstance = new User(user.username, email, user.password, token, expire);
    await userInstance.save();

    await enviarCorreoRecuperacion(email, token);
    res.send({ mensaje: 'Se ha enviado un enlace de recuperación a tu correo electrónico' });
  } catch (error) {
    console.error('Error en solicitud de recuperación:', error);
    res.status(500).send({ message: 'Error al procesar la solicitud' });
  }
};

module.exports = recuperarContrasenaController;
