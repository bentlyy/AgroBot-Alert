const express = require('express');
const router = express.Router();
const MedicionesController = require('../controllers/medicionesController');

const medicionesController = new MedicionesController();

router.get('/sensor/:id_sensor', medicionesController.obtenerMedicionesPorSensor.bind(medicionesController));
router.get('/sensor/:id_sensor/ultima', medicionesController.obtenerUltimaMedicion.bind(medicionesController));
router.get('/unidad/:id_unidad', medicionesController.obtenerMedicionesPorUnidad.bind(medicionesController));
router.post('/', medicionesController.guardarMedicion.bind(medicionesController));

module.exports = router;
