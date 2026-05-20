const express = require('express');
const router = express.Router();
const SensoresController = require('../controllers/sensoresController');
const pool = require('../utils/dbConnection');

const sensoresController = new SensoresController();

router.get('/', async (req, res, next) => {
  try {
    const sensores = await sensoresController.obtenerTodosLosSensores();
    res.json(sensores);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await sensoresController.guardarSensoresDeAPI(req.body);
    res.send('Sensores guardados exitosamente!');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
