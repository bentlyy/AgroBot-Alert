//recuperarContraseñaRoutes.js
const express = require('express');
const router = express.Router();
const { solicitarRecuperacionContraseña, restablecerContraseña } = require('../controllers/recuperarContraseñaController');

router.post('/solicitar-recuperacion', solicitarRecuperacionContraseña);
router.post('/restablecer-contraseña/:token', restablecerContraseña);

module.exports = router;
