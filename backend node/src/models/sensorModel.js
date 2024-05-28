// unidadesModel.js
const pool = require('../utils/dbConnection');

class SensoresModel {
  constructor(pool) {  
    this.pool = pool;
  }

  async guardarSensor(sensor) {
    const { id_unidad, temperatura_s1, temperatura_s2, humedad_s1, humedad_s2, electroconductividad_s1, electroconductividad_s2, gps_energia, energia_externa } = sensor;

    try {
      // Insertar los valores de los sensores en la base de datos
      const query = 'INSERT INTO sensores (id_unidad, temperatura_s1, temperatura_s2, humedad_s1, humedad_s2, electroconductividad_s1, electroconductividad_s2, gps_energia, energia_externa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      await new Promise((resolve, reject) => {
        this.pool.query(query, [id_unidad, temperatura_s1, temperatura_s2, humedad_s1, humedad_s2, electroconductividad_s1, electroconductividad_s2, gps_energia, energia_externa], (error, results, fields) => {
          if (error) {
            console.error('Error al guardar el sensor:', error);
            return reject(new Error('Error al guardar el sensor'));
          }
          resolve(results);
        });
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SensoresModel;
