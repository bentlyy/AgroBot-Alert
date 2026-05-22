const express = require('express');
const router = express.Router();
const recuperarContrasenaController = require('../controllers/recuperarContrasenaController');
const { authRateLimiter } = require('../utils/rateLimiter');

router.post('/solicitar-recuperacion', authRateLimiter, recuperarContrasenaController.solicitarRecuperacion);

module.exports = router;
