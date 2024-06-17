const SensoresModel = require('../models/sensorModel');
const pool = require('../utils/dbConnection');

class SensoresController {
  constructor() {
    this.sensorModel = new SensoresModel(pool);
  }

  async obtenerTodosLosSensores() {
    try {
      return await this.sensorModel.obtenerSensores();
    } catch (error) {
      console.error('Error obteniendo sensores:', error);
      throw new Error('Error obteniendo sensores');
    }
  }

  async guardarSensoresDeAPI(datosSensor) {
    try {
      for (const sensor of datosSensor) {
        // Verifica si el sensor ya está en la base de datos
        const sensoresExistentes = await this.sensorModel.obtenerSensores();
        if (sensoresExistentes.some(u => u.nombre === sensor.nombre)) {
          console.log(`Sensor con nombre ${sensor.nombre} ya está guardado.`);
        } else {
          await this.sensorModel.guardarSensor(sensor);
        }
      }
      console.log('¡Sensores guardados exitosamente!');
    } catch (error) {
      console.error('Error guardando sensores:', error);
      throw new Error('Error guardando sensores');
    }
  }
}

module.exports = SensoresController;
