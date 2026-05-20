const pool = require('../utils/dbConnection');

class AlertasModel {
  static getAll(callback) {
    const SQL = 'SELECT * FROM alertas ORDER BY fecha_creacion DESC';
    pool.query(SQL, callback);
  }

  static create(mensaje, tipo, id_unidad, id_criterio, callback) {
    const SQL = 'INSERT INTO alertas (mensaje, tipo, id_unidad, id_criterio) VALUES (?, ?, ?, ?)';
    pool.query(SQL, [mensaje, tipo, id_unidad, id_criterio], callback);
  }
}

module.exports = AlertasModel;
