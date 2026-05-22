const express = require('express');
const router = express.Router();
const MedicionesController = require('../controllers/medicionesController');
const { authMiddleware } = require('../utils/authMiddleware');

const medicionesController = new MedicionesController();

router.get('/sensor/:id_sensor', authMiddleware, medicionesController.obtenerMedicionesPorSensor.bind(medicionesController));
router.get('/sensor/:id_sensor/ultima', authMiddleware, medicionesController.obtenerUltimaMedicion.bind(medicionesController));
router.get('/unidad/:id_unidad', authMiddleware, medicionesController.obtenerMedicionesPorUnidad.bind(medicionesController));
router.post('/', authMiddleware, medicionesController.guardarMedicion.bind(medicionesController));

module.exports = router;
