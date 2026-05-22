const express = require('express');
const router = express.Router();
const UnidadesController = require('../controllers/unidadesController');
const { authMiddleware } = require('../utils/authMiddleware');

const unidadesController = new UnidadesController();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const isAdmin = req.user && req.user.rol === 'admin';
    const idUsuario = isAdmin ? (req.query.id_usuario || null) : req.user.id;
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
