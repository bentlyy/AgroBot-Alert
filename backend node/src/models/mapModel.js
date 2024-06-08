//mapModel.js
const pool = require('../utils/dbConnection');

class MapModel {
  constructor(pool) {
    this.pool = pool;
  }

  async obtenerDatosMapa() {
    const query = `
      SELECT u.id_unidad, u.nombre, u.latitude, u.longitude, s.sensorData, s.otherInfo
      FROM unidades u
      LEFT JOIN sensores s ON u.id_unidad = s.id_unidad
    `;
    return new Promise((resolve, reject) => {
      this.pool.query(query, (error, results) => {
        if (error) {
          console.error('Error obteniendo datos del mapa:', error);
          return reject(new Error('Error obteniendo datos del mapa'));
        }
        resolve(results);
      });
    });
  }
}

module.exports = MapModel;
