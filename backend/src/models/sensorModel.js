const pool = require('../utils/dbConnection');

class SensoresModel {
  constructor(pool) {
    this.pool = pool;
  }

  async obtenerSensores() {
    const query = 'SELECT * FROM sensores';
    return new Promise((resolve, reject) => {
      this.pool.query(query, (error, results) => {
        if (error) {
          console.error('Error obteniendo sensores:', error);
          return reject(new Error('Error obteniendo sensores'));
        }
        resolve(results);
      });
    });
  }

  async guardarSensor(sensor) {
    const {
      id_unidad, temperatura_s1, temperatura_s2,
      humedad_s1, humedad_s2,
      electroconductividad_s1, electroconductividad_s2,
      gps_energia, energia_externa
    } = sensor;

    try {
      const query = `INSERT INTO sensores
        (id_unidad, temperatura_s1, temperatura_s2, humedad_s1, humedad_s2,
         electroconductividad_s1, electroconductividad_s2, gps_energia, energia_externa)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await new Promise((resolve, reject) => {
        this.pool.query(query,
          [id_unidad, temperatura_s1, temperatura_s2, humedad_s1, humedad_s2,
           electroconductividad_s1, electroconductividad_s2, gps_energia, energia_externa],
          (error, results) => {
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
