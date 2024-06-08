//mapController.js
const MapModel = require('../models/mapModel');
const pool = require('../utils/dbConnection');

class MapController {
  constructor() {
    this.mapModel = new MapModel(pool);
  }

  async obtenerDatosMapa() {
    try {
      return await this.mapModel.obtenerDatosMapa();
    } catch (error) {
      console.error('Error obteniendo datos del mapa:', error);
      throw new Error('Error obteniendo datos del mapa');
    }
  }
}

module.exports = MapController;
