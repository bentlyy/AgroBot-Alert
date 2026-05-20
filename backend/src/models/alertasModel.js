const pool = require('../utils/dbConnection');

class AlertasModel {
  static getAll(callback, idUsuario) {
    let SQL = `SELECT a.*, u.nombre AS unidad_nombre,
      us.nombre AS usuario_nombre, us.email AS usuario_email, us.telefono AS usuario_telefono
      FROM alertas a
      JOIN unidades u ON a.id_unidad = u.id_unidad
      LEFT JOIN usuarios us ON u.id_usuario = us.id`;
    const params = [];
    if (idUsuario) {
      SQL += ' WHERE u.id_usuario = ?';
      params.push(idUsuario);
    }
    SQL += ' ORDER BY a.fecha_creacion DESC';
    pool.query(SQL, params, callback);
  }

  static create(mensaje, tipo, id_unidad, id_criterio, callback) {
    const SQL = 'INSERT INTO alertas (mensaje, tipo, id_unidad, id_criterio) VALUES (?, ?, ?, ?)';
    pool.query(SQL, [mensaje, tipo, id_unidad, id_criterio], callback);
  }
}

module.exports = AlertasModel;
