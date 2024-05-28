// unidadesController.js
const UnidadesModel = require('../models/unidadesModel');
const pool = require('../utils/dbConnection');

class UnidadesController {
  constructor() {
    this.unidadesModel = new UnidadesModel(pool);
  }

  async obtenerTodasLasUnidades() {
    try {
      return await this.unidadesModel.obtenerUnidades();
    } catch (error) {
      console.error('Error obteniendo unidades:', error);
      throw new Error('Error obteniendo unidades');
    }
  }

  async guardarUnidadesDeAPI(datosUnidades) {
    try {
      for (const unidad of datosUnidades) {
        // Verifica si la unidad ya está en la base de datos
        const unidadesExistentes = await this.unidadesModel.obtenerUnidades();
        if (unidadesExistentes.some(u => u.id_unidad === unidad.id)) {
          console.log(`Unidad con ID ${unidad.id} ya está guardada.`);
        } else {
          await this.unidadesModel.guardarUnidad(unidad);
        }
      }
      console.log('¡Unidades guardadas exitosamente!');
    } catch (error) {
      console.error('Error guardando unidades:', error);
      throw new Error('Error guardando unidades');
    }
  }
}

module.exports = UnidadesController;
