const express = require('express');
const router = express.Router();
const UnidadesController = require('../controllers/unidadesController');
const pool = require('../utils/dbConnection');

const unidadesController = new UnidadesController();

router.get('/', async (req, res, next) => {
  try {
    const idUsuario = req.query.id_usuario || null;
    const unidades = await unidadesController.obtenerTodasLasUnidades(idUsuario);
    res.json(unidades);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await unidadesController.guardarUnidadesDeAPI(req.body);
    res.send('Unidades guardadas exitosamente!');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
