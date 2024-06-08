const MedicionesModel = require('../models/medicionesModel');
const pool = require('../utils/dbConnection');

class MedicionesController {
  constructor() {
    this.medicionesModel = new MedicionesModel(pool);
  }

  async obtenerUltimaMedicion(id_sensor) {
    try {
      return await this.medicionesModel.obtenerUltimaMedicion(id_sensor);
    } catch (error) {
      console.error('Error obteniendo última medición:', error);
      throw new Error('Error obteniendo última medición');
    }
  }

  async guardarMedicion(medicion) {
    try {
      await this.medicionesModel.guardarMedicion(medicion);
    } catch (error) {
      console.error('Error guardando medición:', error);
      throw new Error('Error guardando medición');
    }
  }

  async obtenerMedicionesPorSensor(id_sensor) {
    try {
      return await this.medicionesModel.obtenerMedicionesPorSensor(id_sensor);
    } catch (error) {
      console.error('Error obteniendo mediciones por sensor:', error);
      throw new Error('Error obteniendo mediciones por sensor');
    }
  }

  async obtenerMedicionesPorUnidad(id_unidad) {
    try {
      return await this.medicionesModel.obtenerMedicionesPorUnidad(id_unidad);
    } catch (error) {
      console.error('Error obteniendo mediciones por unidad:', error);
      throw new Error('Error obteniendo mediciones por unidad');
    }
  }
}

module.exports = MedicionesController;
