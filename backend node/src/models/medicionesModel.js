const pool = require('../utils/dbConnection');

class MedicionesModel {
  constructor(pool) {
    this.pool = pool;
  }

  async obtenerUltimaMedicion(id_sensor) {
    const query = `
      SELECT * FROM mediciones
      WHERE id_sensor = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    return new Promise((resolve, reject) => {
      this.pool.query(query, [id_sensor], (error, results) => {
        if (error) {
          console.error('Error obteniendo última medición:', error);
          return reject(new Error('Error obteniendo última medición'));
        }
        resolve(results[0]);
      });
    });
  }

  async guardarMedicion(medicion) {
    const { id_sensor, valor, timestamp } = medicion;
    const query = `
      INSERT INTO mediciones (id_sensor, valor, timestamp)
      VALUES (?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      this.pool.query(query, [id_sensor, valor, timestamp], (error, results) => {
        if (error) {
          console.error('Error guardando medición:', error);
          return reject(new Error('Error guardando medición'));
        }
        resolve(results);
      });
    });
  }

  async obtenerMedicionesPorSensor(id_sensor) {
    const query = `
      SELECT * FROM mediciones
      WHERE id_sensor = ?
      ORDER BY timestamp DESC
    `;
    return new Promise((resolve, reject) => {
      this.pool.query(query, [id_sensor], (error, results) => {
        if (error) {
          console.error('Error obteniendo mediciones:', error);
          return reject(new Error('Error obteniendo mediciones'));
        }
        resolve(results);
      });
    });
  }

  async obtenerMedicionesPorUnidad(id_unidad) {
    const query = `
      SELECT m.* FROM mediciones m
      JOIN sensores s ON m.id_sensor = s.id_sensor
      WHERE s.id_unidad = ?
      ORDER BY m.timestamp DESC
    `;
    return new Promise((resolve, reject) => {
      this.pool.query(query, [id_unidad], (error, results) => {
        if (error) {
          console.error('Error obteniendo mediciones por unidad:', error);
          return reject(new Error('Error obteniendo mediciones por unidad'));
        }
        resolve(results);
      });
    });
  }
}

module.exports = MedicionesModel;
