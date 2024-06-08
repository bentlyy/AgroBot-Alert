const pool = require('../utils/dbConnection');

class AlertasModel {
  constructor(pool) {
    this.pool = pool;
  }

  async obtenerAlertas() {
    const query = `
      SELECT a.id_alerta, a.mensaje, a.timestamp, u.nombre AS unidad, s.nombre_sensor, c.nombre_criterio
      FROM alertas a
      JOIN unidades u ON a.id_unidad = u.id_unidad
      JOIN sensores s ON a.id_sensor = s.id_sensor
      JOIN criterios c ON a.id_criterio = c.id_criterio
      ORDER BY a.timestamp DESC
    `;
    return new Promise((resolve, reject) => {
      this.pool.query(query, (error, results) => {
        if (error) {
          console.error('Error obteniendo alertas:', error);
          return reject(new Error('Error obteniendo alertas'));
        }
        resolve(results);
      });
    });
  }

  async obtenerNotificaciones() {
    const query = `
      SELECT n.id_notificacion, n.mensaje, n.timestamp, u.nombre AS unidad
      FROM notificaciones n
      JOIN unidades u ON n.id_unidad = u.id_unidad
      ORDER BY n.timestamp DESC
    `;
    return new Promise((resolve, reject) => {
      this.pool.query(query, (error, results) => {
        if (error) {
          console.error('Error obteniendo notificaciones:', error);
          return reject(new Error('Error obteniendo notificaciones'));
        }
        resolve(results);
      });
    });
  }
}

module.exports = AlertasModel;
