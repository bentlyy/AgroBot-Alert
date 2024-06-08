const express = require('express');
const router = express.Router();
const MapController = require('../controllers/mapController');

const mapController = new MapController();

router.get('/', async (req, res, next) => {
  try {
    const datosMapa = await mapController.obtenerDatosMapa();
    res.json(datosMapa);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
