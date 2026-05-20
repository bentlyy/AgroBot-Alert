const express = require('express');
const router = express.Router();
const recuperarContrasenaController = require('../controllers/recuperarContrasenaController');

router.post('/solicitar-recuperacion', recuperarContrasenaController.solicitarRecuperacion);

module.exports = router;
