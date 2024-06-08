/*const express = require('express');
const router = express.Router();

// Importar el controlador de alertas
const alertasController = require('../controllers/alertasController');

// Definir las rutas y sus controladores
router.get('/', alertasController.getAlertas);
router.post('/', alertasController.createAlerta);
// Agrega más rutas según sea necesario

module.exports = router;*/
const express = require('express');
const router = express.Router();
const AlertasController = require('../controllers/alertasController');

const alertasController = new AlertasController();

router.get('/alertas', async (req, res, next) => {
  try {
    const alertas = await alertasController.obtenerAlertas();
    res.json(alertas);
  } catch (error) {
    next(error);
  }
});

router.get('/notificaciones', async (req, res, next) => {
  try {
    const notificaciones = await alertasController.obtenerNotificaciones();
    res.json(notificaciones);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
