const express = require('express');
const router = express.Router();
const MapController = require('../controllers/mapController');
const { authMiddleware } = require('../utils/authMiddleware');

const mapController = new MapController();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const datosMapa = await mapController.obtenerDatosMapa();
    res.json(datosMapa);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
