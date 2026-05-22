const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertasController');
const { authMiddleware } = require('../utils/authMiddleware');

router.get('/', authMiddleware, alertasController.getAll);
router.post('/', authMiddleware, alertasController.create);
router.post('/generar', authMiddleware, alertasController.generarAlertas);
router.get('/notificaciones/estado', authMiddleware, alertasController.estadoNotificaciones);

module.exports = router;
