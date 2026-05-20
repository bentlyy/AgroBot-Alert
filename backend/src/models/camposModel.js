const pool = require('../utils/dbConnection');

class CamposModel {
  static getAll(callback) {
    const SQL = 'SELECT * FROM campos';
    pool.query(SQL, callback);
  }

  static create(nombre, ubicacion, hectareas, callback) {
    const SQL = 'INSERT INTO campos (nombre, ubicacion, hectareas) VALUES (?, ?, ?)';
    pool.query(SQL, [nombre, ubicacion, hectareas], callback);
  }
}

module.exports = CamposModel;
