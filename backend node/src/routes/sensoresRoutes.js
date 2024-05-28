const express = require('express');
const router = express.Router();

module.exports = (sensoresController, conectividadAPI) => {
  router.get('/', async (req, res, next) => {
    try {
      const sensores = await sensoresController.obtenerTodasLasUnidades();
      res.json(sensores);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      await sensoresController.guardarSensoresDeAPI(req.body);
      res.send('¡Sensores guardados exitosamente!');
    } catch (error) {
      next(error);
    }
  });

  return router;
};
