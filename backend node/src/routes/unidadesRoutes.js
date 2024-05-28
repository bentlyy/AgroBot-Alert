const express = require('express');
const router = express.Router();

module.exports = (unidadesController, conectividadAPI) => {
  router.get('/', async (req, res, next) => {
    try {
      const unidades = await unidadesController.obtenerTodasLasUnidades();
      res.json(unidades);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      await unidadesController.guardarUnidadesDeAPI(req.body);
      res.send('¡Unidades guardadas exitosamente!');
    } catch (error) {
      next(error);
    }
  });

  return router;
};
