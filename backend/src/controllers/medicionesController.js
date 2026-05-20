const MedicionesModel = require('../models/medicionesModel');
const pool = require('../utils/dbConnection');

class MedicionesController {
  constructor() {
    this.medicionesModel = new MedicionesModel(pool);
  }

  async obtenerUltimaMedicion(req, res) {
    const { id_sensor } = req.params;
    try {
      const medicion = await this.medicionesModel.obtenerUltimaMedicion(id_sensor);
      res.json(medicion);
    } catch (error) {
      console.error('Error obteniendo última medición:', error);
      res.status(500).json({ message: 'Error obteniendo última medición' });
    }
  }

  async guardarMedicion(req, res) {
    try {
      await this.medicionesModel.guardarMedicion(req.body);
      res.json({ message: 'Medición guardada exitosamente' });
    } catch (error) {
      console.error('Error guardando medición:', error);
      res.status(500).json({ message: 'Error guardando medición' });
    }
  }

  async obtenerMedicionesPorSensor(req, res) {
    const { id_sensor } = req.params;
    try {
      const mediciones = await this.medicionesModel.obtenerMedicionesPorSensor(id_sensor);
      res.json(mediciones);
    } catch (error) {
      console.error('Error obteniendo mediciones:', error);
      res.status(500).json({ message: 'Error obteniendo mediciones' });
    }
  }

  async obtenerMedicionesPorUnidad(req, res) {
    const { id_unidad } = req.params;
    try {
      const mediciones = await this.medicionesModel.obtenerMedicionesPorUnidad(id_unidad);
      res.json(mediciones);
    } catch (error) {
      console.error('Error obteniendo mediciones por unidad:', error);
      res.status(500).json({ message: 'Error obteniendo mediciones por unidad' });
    }
  }
}

module.exports = MedicionesController;
