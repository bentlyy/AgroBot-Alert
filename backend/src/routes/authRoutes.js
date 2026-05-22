const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuariosController');
const LoginController = require('../controllers/loginController');
const { authRateLimiter } = require('../utils/rateLimiter');

router.post('/register', authRateLimiter, UsuarioController.register);
router.post('/login', authRateLimiter, LoginController.login);

module.exports = router;
