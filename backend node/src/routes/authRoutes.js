//authRoutes.js 

const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuariosController');
const LoginController = require('../controllers/loginController');

router.post('/register', UsuarioController.register);
router.post('/login', LoginController.login);

module.exports = router;
