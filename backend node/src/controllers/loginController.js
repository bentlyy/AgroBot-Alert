//loginController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuariosModel = require('../models/usuariosModel');

class LoginController {
  async login(req, res) {
    const { LoginNombre, LoginContraseña } = req.body;
    try {
      const usuario = await UsuariosModel.findUserByName(LoginNombre);
      if (usuario.length === 0) {
        res.status(401).send({ message: 'Las credenciales no coinciden' });
        return;
      }

      const validPassword = await bcrypt.compare(LoginContraseña, usuario[0].contraseña);
      if (validPassword) {
        const token = jwt.sign({ id: usuario[0].id }, 'your_secret_key', { expiresIn: '1h' });
        res.send({ token });
      } else {
        res.status(401).send({ message: 'Las credenciales no coinciden' });
      }
    } catch (err) {
      console.error('Error iniciando sesión:', err);
      res.status(500).send({ message: 'Error iniciando sesión' });
    }
  }
}

module.exports = new LoginController();
