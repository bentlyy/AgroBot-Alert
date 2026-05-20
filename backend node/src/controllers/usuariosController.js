// usuariosController.js

const bcrypt = require('bcryptjs');
const UsuariosModel = require('../models/usuariosModel');

class UsuariosController {
  async register(req, res) {
    const { Email, Nombre, Contraseña, Rol } = req.body;
    console.log('Datos recibidos para registrar:', req.body);

    try {
      const existingUser = await UsuariosModel.findUserByEmail(Email);
      if (existingUser.length > 0) {
        res.status(400).send({ message: 'El email ya está registrado' });
      } else {
        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Contraseña, saltRounds);
        
        await UsuariosModel.createUser(Email, Nombre, hashedPassword, Rol);
        res.send({ message: 'Usuario agregado' });
      }
    } catch (err) {
      console.error('Error creando usuario:', err);
      res.status(500).send(err);
    }
  }
}

module.exports = new UsuariosController();
