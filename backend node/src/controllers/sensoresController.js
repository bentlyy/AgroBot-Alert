// sensoresController.js
const { searchUnits, loadMessages } = require('../utils/wialonApiUtils');
const SensoresModel = require('../models/sensorModel');

class SensoresController {
  constructor() {
    this.sensorModel = new SensoresModel();
  }

  async guardarSensoresDeAPI() {
    try {
      const unidades = await searchUnits(); // Obtener unidades de la API de Wialon
      for (const unidad of unidades) {
        const mensajes = await loadMessages(unidad.id); // Obtener mensajes de la unidad de la API de Wialon
        await this.sensorModel.guardarSensores(mensajes); // Guardar los mensajes como sensores en la base de datos
      }
      console.log('¡Sensores guardados exitosamente!');
    } catch (error) {
      console.error('Error guardando sensores:', error);
      throw new Error('Error guardando sensores');
    }
  }
}

module.exports = SensoresController;
